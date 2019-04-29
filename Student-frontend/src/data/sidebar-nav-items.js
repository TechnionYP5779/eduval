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
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile-lite",
    }
  ];
}
