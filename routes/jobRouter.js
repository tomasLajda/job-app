import { Router } from 'express';
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJob,
  updateJob,
} from '../controllers/jobController.js';

const router = Router();

// router.get('/', getAllJobs)

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

export default router;
