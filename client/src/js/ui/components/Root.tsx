import { Outlet } from "react-router-dom";
import Layout from "./Layout";
import Navbar from "./Navbar";


export function Root() {
  return (
    <Layout>
      <>
        <Navbar/>
        <Outlet />
      </>
    </Layout>
  )
}