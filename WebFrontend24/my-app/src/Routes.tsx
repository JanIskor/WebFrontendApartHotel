export const ROUTES = {
    HOME: "/",
    APARTMENTS: "/apartments",
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    APARTMENTS: "Апартаменты",
  };