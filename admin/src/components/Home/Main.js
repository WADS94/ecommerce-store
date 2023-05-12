import React from "react";
import TopTotal from "./TopTotal";
import LatestOrder from "./LatestOrder";
import SaleStatistics from "./SalesStatistics";
import ProductsStatistics from "./ProductsStatistics";
import { useSelector } from "react-redux";

const Main = () => {
  const dashboard = useSelector((state) => state.dashboard);
  const { loading, error, dashboardInfo } = dashboard;

  return (
    <>
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title"> Administrare </h2>
        </div>
        {/* Top Total */}
        {dashboardInfo && (
          <TopTotal
            totalSale={dashboardInfo.ordersValue}
            ordersCnt={dashboardInfo.ordersCnt}
            productsCnt={dashboardInfo.productsCnt}
          />
        )}

        <div className="row">
          {/* STATICS */}
          <SaleStatistics />
          <ProductsStatistics />
        </div>

        {/* LATEST ORDER */}
        <div className="card mb-4 shadow-sm">
          {dashboardInfo && (
            <LatestOrder
              orders={dashboardInfo.lastOrders}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default Main;
