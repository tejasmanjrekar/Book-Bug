const ParentConfiguration = require("./ParentConfiguration");

module.exports = {
  AddToWishList: ParentConfiguration.Parent + "api/WishList/AddToWishList",
  GetAllWishListDetails: ParentConfiguration.Parent + "api/WishList/GetAllWishListDetails",
  RemoveWishListProduct: ParentConfiguration.Parent + "api/WishList/RemoveWishListProduct",
  MoveToCard: ParentConfiguration.Parent + "api/WishList/MoveToCard",
};
