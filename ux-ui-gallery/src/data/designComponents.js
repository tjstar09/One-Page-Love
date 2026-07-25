import { motion } from 'framer-motion';
import AgenticLanding from './designs/AgenticLanding';
import BentoLanding from './designs/BentoLanding';
import CafeLanding from './designs/CafeLanding';
import DefaultDesign from './designs/DefaultDesign';

export const designComponents = {
  'agentic-ai-chat-landing': AgenticLanding,
  'bento-grid-dashboard-landing': BentoLanding,
  'cozy-cafe-lifestyle-landing': CafeLanding,
  default: DefaultDesign,
};