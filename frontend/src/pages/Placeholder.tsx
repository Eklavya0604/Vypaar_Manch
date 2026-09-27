import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Placeholder() {
  const location = useLocation();
  const pageName = location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-slate-900">{pageName}</h1>
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          This page is currently under construction. Check back soon for updates!
        </p>
        <Link to="/consumer">
          <Button className="bg-[#185b45] hover:bg-[#124635]">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
