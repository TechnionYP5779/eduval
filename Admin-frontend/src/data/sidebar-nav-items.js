export default function() {
  return [
    {
      title: "Home",
      to: "/overview",
      htmlBefore: '<i class="material-icons">home</i>',
      htmlAfter: ""
    },
    {
      title: "Register Teachers",
      htmlBefore: '<i class="material-icons">person_add</i>',
      to: "/register-teacher",
    },
    {
      title: "Manage School Shop",
      htmlBefore: '<i class="material-icons">store</i>',
      to: "/manage-school-store",
    },
    {
      title: "Manage Teachers",
      htmlBefore: '<i class="material-icons">people</i>',
      to: "/manage-teachers",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile-lite",
    }
  ];
}
