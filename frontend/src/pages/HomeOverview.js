// src/pages/HomeOverview.js
import React from "react";
import StatCard from "../components/StatCard";
import ChartPlaceholder from "../components/ChartPlaceholder";
import MapComponent from "../components/MapComponent";
import PhLineChart from "../components/PhLineChart";

const HomeOverview = ({ stats = [] }) => {
  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><PhLineChart /></div>
        <div><ChartPlaceholder title="Turbidity Trend" /></div>
      </section>

      <section><MapComponent /></section>
    </>
  );
};

export default HomeOverview;
