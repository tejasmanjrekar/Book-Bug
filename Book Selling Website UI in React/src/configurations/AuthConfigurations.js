const ParentConfiguration = require("./ParentConfiguration");

module.exports = {
  SignUp: ParentConfiguration.Parent + "api/Auth/SignUp",
  SignIn: ParentConfiguration.Parent + "api/Auth/SignIn",
  EmailService: ParentConfiguration.EmailParent + "/api/Email/EmailService",
  AddCustomerDetail: ParentConfiguration.Parent + "api/Auth/AddCustomerDetail",
  CustomerList: ParentConfiguration.Parent + "api/Auth/CustomerList",
  AddCustomerAdderess:
    ParentConfiguration.Parent + "api/Auth/AddCustomerAdderess",
  GetCustomerAdderess:
    ParentConfiguration.Parent + "api/Auth/GetCustomerAdderess?userId=",
  GetCustomerDetail:
    ParentConfiguration.Parent + "api/Auth/GetCustomerDetail?userId=",
};
