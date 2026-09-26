import { Request, Response } from 'express';
import prisma from '../config/db';

export const getAllBusinesses = async (req: Request, res: Response) => {
  try {
    const { category, state, city, sortBy } = req.query;

    let orderBy: any = [{ isPremium: 'desc' }];
    
    switch (sortBy) {
      case 'rating':
        orderBy.push({ averageRating: 'desc' });
        break;
      case 'reviews':
        orderBy.push({ totalReviews: 'desc' });
        break;
      case 'newest':
        orderBy.push({ createdAt: 'desc' });
        break;
      case 'name':
        orderBy.push({ name: 'asc' });
        break;
      default:
        orderBy.push({ averageRating: 'desc' });
    }

    const where: any = { isActive: true };

    if (category && category !== 'all') {
      where.category = category as string;
    }
    if (state) {
      where.state = { contains: state as string, mode: 'insensitive' };
    }
    
    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }
    
    const businesses = await prisma.business.findMany({
      where,
      orderBy,
      take: 50
    });

    res.status(200).json(businesses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBusinessBySlugOrId = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    // Try by slug first, then by ID
    let business = await prisma.business.findFirst({
      where: {
        slug: identifier,
        isActive: true,
      },
      include: {
        services: {
          where: { isActive: true, isAvailable: true }
        },
        reviews: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!business) {
      business = await prisma.business.findFirst({
        where: {
          id: identifier,
          isActive: true,
        },
        include: {
          services: {
            where: { isActive: true, isAvailable: true }
          },
          reviews: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });
    }

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.status(200).json(business);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const data = req.body;

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    const business = await prisma.business.create({
      data: {
        ...data,
        ownerId: userId,
        slug
      }
    });

    res.status(201).json(business);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyBusinesses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const businesses = await prisma.business.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(businesses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBusinessData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const requestsData = await prisma.serviceRequest.findMany({
      where: { businessId: id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const viewsCount = await prisma.businessView.count({
      where: {
        businessId: id,
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    const contactsCount = await prisma.contactLog.count({
      where: {
        businessId: id,
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    res.status(200).json({
      requests: requestsData || [],
      viewsCount: viewsCount || 0,
      contactsCount: contactsCount || 0
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateServiceRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await prisma.serviceRequest.update({
      where: { id },
      data: updates
    });
    res.status(200).json({ message: 'Updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logBusinessView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.businessView.create({
      data: { businessId: id }
    });
    // Increment total views on Business
    await prisma.business.update({
      where: { id },
      data: { totalViews: { increment: 1 } }
    });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.contactLog.create({
      data: { businessId: id }
    });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const submitServiceRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { serviceId, consumerId, description, consumerPhone, consumerEmail } = req.body;
    
    await prisma.serviceRequest.create({
      data: {
        businessId: id,
        serviceId,
        consumerId,
        description,
        consumerPhone,
        consumerEmail
      }
    });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
