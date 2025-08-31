import { db } from '@repo/db';
import { 
  bins, 
  inventoryInstances, 
  items, 
  shelves 
} from '@repo/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const inventoryRouter = router({
  // Storage management
  createShelf: publicProcedure
    .input(z.object({ 
      name: z.string(), 
      description: z.string().optional() 
    }))
    .mutation(async ({ input }) => {
      const [shelf] = await db.insert(shelves).values({
        name: input.name,
        description: input.description,
      }).returning();
      
      return { success: true, shelf };
    }),
  
  createBin: publicProcedure
    .input(z.object({ 
      shelfId: z.number(), 
      name: z.string(),
      description: z.string().optional() 
    }))
    .mutation(async ({ input }) => {
      const [bin] = await db.insert(bins).values({
        shelfId: input.shelfId,
        name: input.name,
        description: input.description,
      }).returning();
      
      return { success: true, bin };
    }),

  // Item management
  createItem: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      cost: z.number(),
      listingPrice: z.number(),
      quantity: z.number(),
      shelfId: z.number(),
      binId: z.number(),
      category: z.string().optional(),
      condition: z.string().optional(),
      platforms: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      // Create the item
      const [item] = await db.insert(items).values({
        title: input.title,
        description: input.description,
        cost: input.cost.toString(),
        listingPrice: input.listingPrice.toString(),
        category: input.category,
        condition: input.condition,
      }).returning();

      // Create inventory instances based on quantity
      const instancesData = Array.from({ length: input.quantity }, () => ({
        itemId: item.id,
        shelfId: input.shelfId,
        binId: input.binId,
        status: 'available' as const,
        notes: input.platforms ? `Platforms: ${input.platforms.join(', ')}` : null,
      }));

      const instances = await db.insert(inventoryInstances).values(instancesData).returning();

      return { 
        success: true, 
        item,
        instances: instances.length,
      };
    }),

  markItemSold: publicProcedure
    .input(z.object({
      inventoryInstanceId: z.number(),
      soldPrice: z.number(),
      platform: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [updatedInstance] = await db
        .update(inventoryInstances)
        .set({
          status: 'sold',
          soldPrice: input.soldPrice.toString(),
          soldDate: new Date(),
          platform: input.platform,
          notes: input.notes,
        })
        .where(eq(inventoryInstances.id, input.inventoryInstanceId))
        .returning();

      return { success: true, instance: updatedInstance };
    }),

  getInventory: publicProcedure
    .input(z.object({
      status: z.enum(['available', 'sold', 'all']).default('available'),
      shelfId: z.number().optional(),
      binId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      let whereConditions = [];

      // Filter by status
      if (input.status !== 'all') {
        whereConditions.push(eq(inventoryInstances.status, input.status));
      }

      // Filter by shelf
      if (input.shelfId) {
        whereConditions.push(eq(inventoryInstances.shelfId, input.shelfId));
      }

      // Filter by bin
      if (input.binId) {
        whereConditions.push(eq(inventoryInstances.binId, input.binId));
      }

      const inventory = await db.query.inventoryInstances.findMany({
        where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
        with: {
          item: true,
          shelf: true,
          bin: true,
        },
      });

      return inventory;
    }),

  // Get all shelves with their bins
  getShelves: publicProcedure.query(async () => {
    const shelvesData = await db.query.shelves.findMany({
      with: {
        bins: true,
      },
    });

    return shelvesData;
  }),

  // Get inventory summary stats
  getInventoryStats: publicProcedure.query(async () => {
    const totalInstances = await db.query.inventoryInstances.findMany();
    
    const available = totalInstances.filter(i => i.status === 'available').length;
    const sold = totalInstances.filter(i => i.status === 'sold').length;
    const reserved = totalInstances.filter(i => i.status === 'reserved').length;

    // Calculate total revenue from sold items
    const totalRevenue = totalInstances
      .filter(i => i.status === 'sold' && i.soldPrice)
      .reduce((sum, instance) => sum + Number(instance.soldPrice), 0);

    return {
      totalItems: totalInstances.length,
      available,
      sold,
      reserved,
      totalRevenue,
    };
  }),

  // Update item details
  updateItem: publicProcedure
    .input(z.object({
      itemId: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      cost: z.number().optional(),
      listingPrice: z.number().optional(),
      category: z.string().optional(),
      condition: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const updateData: any = {};
      
      if (input.title) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.cost) updateData.cost = input.cost.toString();
      if (input.listingPrice) updateData.listingPrice = input.listingPrice.toString();
      if (input.category !== undefined) updateData.category = input.category;
      if (input.condition !== undefined) updateData.condition = input.condition;
      
      updateData.updatedAt = new Date();

      const [updatedItem] = await db
        .update(items)
        .set(updateData)
        .where(eq(items.id, input.itemId))
        .returning();

      return { success: true, item: updatedItem };
    }),

  // Move inventory instance to different location
  moveInventoryInstance: publicProcedure
    .input(z.object({
      inventoryInstanceId: z.number(),
      shelfId: z.number(),
      binId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const [updatedInstance] = await db
        .update(inventoryInstances)
        .set({
          shelfId: input.shelfId,
          binId: input.binId,
        })
        .where(eq(inventoryInstances.id, input.inventoryInstanceId))
        .returning();

      return { success: true, instance: updatedInstance };
    }),
});