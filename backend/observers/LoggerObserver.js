const gymEvents = require('../events/gymEvents');

class LoggerObserver {
  constructor() {
    gymEvents.on('userRegistered', ({ name, email, role }) =>
      console.log(`[LOG] New ${role} registered: ${name} (${email})`)
    );
    gymEvents.on('userCreated', ({ name, email, role }) =>
      console.log(`[LOG] Admin created user: ${name} (${email}) as ${role}`)
    );
    gymEvents.on('userUpdated', ({ name, email }) =>
      console.log(`[LOG] User updated: ${name} (${email})`)
    );
    gymEvents.on('userDeleted', ({ id }) =>
      console.log(`[LOG] User deleted: ${id}`)
    );
    gymEvents.on('courseCreated', ({ name, vendorId }) =>
      console.log(`[LOG] New course created: ${name} by vendor ${vendorId}`)
    );
    gymEvents.on('membershipTransitioned', ({ name, email, from, to }) =>
      console.log(`[LOG] Membership changed for ${name} (${email}): ${from} → ${to}`)
    );
    gymEvents.on('planCreated', ({ title, memberName }) =>
      console.log(`[LOG] Workout plan "${title}" assigned to ${memberName}`)
    );
  }
}

module.exports = LoggerObserver;
