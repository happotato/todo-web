import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import configureStore from "~/services/store";
import Home from "~/views/Home";
import "~/services/i18n";
import "~/style.scss";

render(
  <Provider store={configureStore()}>
    <React.Suspense fallback={"Loading"}>
      <Router>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </React.Suspense>
  </Provider>
  , document.querySelector("#root"));
