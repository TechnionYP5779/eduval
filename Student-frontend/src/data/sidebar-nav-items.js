export default function() {
  return [
    {
      title: "Home",
      to: "/overview",
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: ""
    },
    {
      title: "My Courses",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/my-courses",
    },
    {
      title: "My Products",
      htmlBefore: '<i class="material-icons">shopping_cart</i>',
      to: "/my-products",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile-lite",
    }
  ];
}
