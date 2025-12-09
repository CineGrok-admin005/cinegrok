/**
 * /productions/new
 * Page for creating a new production
 */

import CreateProjectForm from '@/components/CreateProjectForm';

export default function NewProductionPage() {
  return (
    <div className="page-wrapper">
      <CreateProjectForm isProduction={true} />
    </div>
  );
}
