const DataTypes = require("sequelize").DataTypes;
const _Destination = require("./Destination");
const _Driver = require("./Driver");
const _Favorites = require("./Favorites");
const _Lift = require("./Lift");
const _Rate_Comment = require("./Rate_Comment");
const _Route = require("./Route");
const _User = require("./User");
const _Vehicle = require("./Vehicle");
const _Waiting_List = require("./Waiting_List");

function initModels(sequelize) {
  const Destination = _Destination(sequelize, DataTypes);
  const Driver = _Driver(sequelize, DataTypes);
  const Favorites = _Favorites(sequelize, DataTypes);
  const Lift = _Lift(sequelize, DataTypes);
  const Rate_Comment = _Rate_Comment(sequelize, DataTypes);
  const Route = _Route(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);
  const Vehicle = _Vehicle(sequelize, DataTypes);
  const Waiting_List = _Waiting_List(sequelize, DataTypes);

  Driver.belongsToMany(User, { as: 'passengerID_Users', through: Waiting_List, foreignKey: "driverID", otherKey: "passengerID" });
  User.belongsToMany(Driver, { as: 'driverID_Drivers', through: Waiting_List, foreignKey: "passengerID", otherKey: "driverID" });
  User.belongsToMany(User, { as: 'userID2_Users', through: Favorites, foreignKey: "userID1", otherKey: "userID2" });
  User.belongsToMany(User, { as: 'userID1_Users', through: Favorites, foreignKey: "userID2", otherKey: "userID1" });
  Route.belongsTo(Driver, { as: "driver", foreignKey: "driverID"});
  Driver.hasMany(Route, { as: "Routes", foreignKey: "driverID"});
  Waiting_List.belongsTo(Driver, { as: "driver", foreignKey: "driverID"});
  Driver.hasMany(Waiting_List, { as: "Waiting_Lists", foreignKey: "driverID"});
  Rate_Comment.belongsTo(Lift, { as: "passenger", foreignKey: "passengerID"});
  Lift.hasMany(Rate_Comment, { as: "Rate_Comments", foreignKey: "passengerID"});
  Rate_Comment.belongsTo(Lift, { as: "driver", foreignKey: "driverID"});
  Lift.hasMany(Rate_Comment, { as: "driver_Rate_Comments", foreignKey: "driverID"});
  Rate_Comment.belongsTo(Lift, { as: "plate_Lift", foreignKey: "plate"});
  Lift.hasMany(Rate_Comment, { as: "plate_Rate_Comments", foreignKey: "plate"});
  Rate_Comment.belongsTo(Lift, { as: "lift", foreignKey: "liftID"});
  Lift.hasMany(Rate_Comment, { as: "lift_Rate_Comments", foreignKey: "liftID"});
  Destination.belongsTo(User, { as: "user", foreignKey: "userID"});
  User.hasMany(Destination, { as: "Destinations", foreignKey: "userID"});
  Driver.belongsTo(User, { as: "driver", foreignKey: "driverID"});
  User.hasOne(Driver, { as: "Driver", foreignKey: "driverID"});
  Favorites.belongsTo(User, { as: "userID1_User", foreignKey: "userID1"});
  User.hasMany(Favorites, { as: "Favorites", foreignKey: "userID1"});
  Favorites.belongsTo(User, { as: "userID2_User", foreignKey: "userID2"});
  User.hasMany(Favorites, { as: "userID2_Favorites", foreignKey: "userID2"});
  Lift.belongsTo(User, { as: "passenger", foreignKey: "passengerID"});
  User.hasMany(Lift, { as: "Lifts", foreignKey: "passengerID"});
  Vehicle.belongsTo(User, { as: "driver", foreignKey: "driverID"});
  User.hasMany(Vehicle, { as: "Vehicles", foreignKey: "driverID"});
  Waiting_List.belongsTo(User, { as: "passenger", foreignKey: "passengerID"});
  User.hasMany(Waiting_List, { as: "Waiting_Lists", foreignKey: "passengerID"});
  Lift.belongsTo(Vehicle, { as: "driver", foreignKey: "driverID"});
  Vehicle.hasMany(Lift, { as: "Lifts", foreignKey: "driverID"});
  Lift.belongsTo(Vehicle, { as: "plate_Vehicle", foreignKey: "plate"});
  Vehicle.hasMany(Lift, { as: "plate_Lifts", foreignKey: "plate"});

  return {
    Destination,
    Driver,
    Favorites,
    Lift,
    Rate_Comment,
    Route,
    User,
    Vehicle,
    Waiting_List,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
