function (user, context, callback) {
    const teacherRole = 'teacher';
    const studentRole = 'student';
    const teacherClient = 'Emon Teachers';
    const studentClient = 'Emon Students';
    const displayName = {};
    displayName[teacherClient] = "the teacher application";
    displayName[studentClient] = "the student application";
  
    user.app_metadata = user.app_metadata || {};
    user.app_metadata.user_type = user.app_metadata.user_type ||
      (context.clientName === teacherClient ? teacherRole : studentRole);
    context.idToken['https://emon-teach.com/user_type'] = user.app_metadata.user_type;
  
    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function(){
          const userRole = user.app_metadata.user_type;
          if ((context.clientName === teacherClient && userRole !== teacherRole) ||
              (context.clientName === studentClient && userRole !== studentRole)) {
            callback(new UnauthorizedError(`A ${userRole} can't log in to ${displayName[context.clientName]}.`));
          } else {
            callback(null, user, context);
          }
      })
      .catch(function(err){
          callback(err);
      });
    
  }
  