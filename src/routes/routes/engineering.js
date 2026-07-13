import MainLayout from 'layouts/MainLayout';
import Eng013_MaintenanceBudgetSparepart from 'pages/engineering/eng013_maintenanceBudgetSparepart';
import { Route, Routes } from 'react-router-dom';

const EngineeringRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="engineering/eng013_maintenanceBudgetSparepart"
          element={<Eng013_MaintenanceBudgetSparepart />}
        />
      </Route>
    </Routes>
  );
};

export default EngineeringRoutes;
