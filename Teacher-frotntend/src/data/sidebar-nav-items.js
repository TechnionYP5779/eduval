export default function() {
  return [
    {
      title: "Home",
      to: "/overview",
      htmlBefore: 'DONEEE<i class="material-icons">edit</i>',
      htmlAfter: ""
    },
    {
      title: "My Courses",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/my-courses",
    },
    {
      title: "Add New Course",
      htmlBefore: 'DONEEE<i class="material-icons">note_add</i>',
      to: "/add-new-course",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile-lite",
    },
    {
      title: "Trial Lesson",
      htmlBefore: 'DONEEE<i class="material-icons">flash_on</i>',
      to: "/demo-lesson",
    }
  ];
}
