import express from 'express';
import { 
  getAllBusinesses, 
  getMyBusinesses, 
  getBusinessData, 
  updateServiceRequest,
  getBusinessBySlugOrId,
  logBusinessView,
  logContact,
  submitServiceRequest,
  createBusiness
} from '../controllers/business.controller';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllBusinesses);
router.post('/', requireAuth, createBusiness);
router.get('/me', requireAuth, getMyBusinesses);
router.get('/:identifier', getBusinessBySlugOrId);
router.post('/:id/views', logBusinessView);
router.post('/:id/contacts', logContact);
router.post('/:id/service-requests', submitServiceRequest);
router.get('/:id/data', requireAuth, getBusinessData);
router.patch('/service-requests/:id', requireAuth, updateServiceRequest);

export default router;
