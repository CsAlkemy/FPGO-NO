import FuseUtils from "@fuse/utils";
import AppContext from "app/AppContext";
import { Component } from "react";
import { matchRoutes } from "react-router-dom";
import withRouter from "@fuse/core/withRouter";
import history from "@history";
import {
  BUSINESS_ADMIN,
  FP_ADMIN,
} from "../../../app/utils/user-roles/UserRoles";

let loginRedirectUrl = null;

class FuseAuthorization extends Component {
  constructor(props, context) {
    super(props);
    const { routes } = context;
    this.state = {
      accessGranted: true,
      routes,
    };
    this.defaultLoginRedirectUrl = props.loginRedirectUrl || "/";
  }

  componentDidMount() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.accessGranted !== this.state.accessGranted;
  }

  componentDidUpdate() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { location, userRole } = props;
    const { pathname } = location;

    const matchedRoutes = matchRoutes(state.routes, pathname);

    const matched = matchedRoutes ? matchedRoutes[0] : false;
    return {
      accessGranted: matched
        ? FuseUtils.hasPermission(matched.route.auth, userRole)
        : true,
    };
  }

  redirectRoute() {
    const { location, userRole } = this.props;
    const { pathname } = location;
    // COMMENTED BY JONI. Due we don't' want user to redirect back to prev path instead of dashboard
    // const redirectUrl = loginRedirectUrl || this.defaultLoginRedirectUrl;
    // const redirectUrl = "/dashboard"; // FRON536- change redirect URL
    // const redirectUrl = "/sales/orders-list";
    const redirectUrl =
      userRole[0] === FP_ADMIN || userRole[0] === BUSINESS_ADMIN
        ? "/dashboard"
        : "/sales/orders-list";

    /*
     *  User is guest
     *  Redirect to Login Page
     */
    if (!userRole || userRole.length === 0) {
      if (
        pathname.includes("/order/details/") ||
        pathname.includes("/reservations/details/") ||
        pathname.includes("/order/receipt/")
      )
        setTimeout(() => history.push(pathname), 0);
      else setTimeout(() => history.push("/login"), 0);
      loginRedirectUrl = pathname;
    } else {
      /*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or loginRedirectUrl
        */
      // Commented by J.K. Sutradhor As we have to scope the user to access the payments pages both for authenticated and unauthenticated
      // setTimeout(() => history.push(redirectUrl), 0);
      //Added this if condition to access if pages related to the order/details and if not then to redirectUrl
      if (
        pathname.includes("/order/details/") ||
        pathname.includes("/reservations/details/") ||
        pathname.includes("/order/receipt/")
      )
        setTimeout(() => history.push(pathname), 0);
      else setTimeout(() => history.push(redirectUrl), 0);
      loginRedirectUrl = this.defaultLoginRedirectUrl;
    }
  }

  render() {
    // console.info('Fuse Authorization rendered', this.state.accessGranted);
    //This line commented by JK Sutradhor as we need to render the order pages that who have the link.
    // return this.state.accessGranted ? <>{this.props.children}</> : null;

    return this.state.accessGranted ||
      window.location.pathname.includes("/reservations/details/") ||
      window.location.pathname.includes("/order/details/") ||
      window.location.pathname.includes("/order/receipt/") ? (
      <>{this.props.children}</>
    ) : null;
  }
}

FuseAuthorization.contextType = AppContext;

export default withRouter(FuseAuthorization);
