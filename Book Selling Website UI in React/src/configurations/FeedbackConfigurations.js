const ParentConfiguration = require("./ParentConfiguration");

module.exports = {
  GetFeedbacks: ParentConfiguration.Parent + "api/Feedback/GetFeedbacks",
  AddFeedback: ParentConfiguration.Parent + "api/Feedback/AddFeedback",
  DeleteFeedback: ParentConfiguration.Parent + "api/Feedback/DeleteFeedback?feedbackId=",
};
