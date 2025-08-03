import React from 'react'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {ConnectionsMapHeader} from "./ConnectionsMapHeader.tsx";
import {OverviewPage} from "./components/overview/OverviewPage.tsx";
import {ParentChildPage} from "./components/parent-child/ParentChildPage.tsx";
import {TreeofLifePage} from "./components/tree-of-life/TreeofLifePage.tsx";
import {FamilySizePage} from "./components/family-size/FamilySizePage.tsx";
import {FamilyNamesPage} from "./components/family-names/FamilyNamesPage.tsx";

const ConnectionsMapPage: React.FC = () => {
  return (
    <Routes>
      <Route
        element={
          <>
            <ConnectionsMapHeader />
            <Outlet />
          </>
        }
      >
        <Route
          path='overview'
          element={<OverviewPage />}
        />
        <Route
          path='parent-child'
          element={<ParentChildPage />}
        />
        <Route
          path='tree-of-life'
          element={<TreeofLifePage />}
        />
        <Route
          path='family-size'
          element={<FamilySizePage />}
        />
        <Route
          path='family-names'
          element={<FamilyNamesPage />}
        />
        <Route index element={<Navigate to='/connections-map/overview' />} />
      </Route>
    </Routes>
  )
}

export default ConnectionsMapPage
