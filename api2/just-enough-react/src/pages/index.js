import { BrowserRouter as Router, Route } from "react-router-dom";
import React from "react";
import Home from "./home";
import MyNotes from "./mynote";
import Favorites from "./favorites";
import Header from "../components/Header";
import Navigation from "../components/Navigation";

const Pages = () => {
  return (
    <>
      <Header />

      <Router>
        <Navigation />
        <Route exact path="/" component={Home} />
        <Route path="/mynotes" component={MyNotes} />
        <Route path="/favorites" component={Favorites} />
      </Router>
    </>
  );
};
export default Pages;
