const ParentConfiguration = require("./ParentConfiguration");

module.exports = {
  AddProduct: ParentConfiguration.Parent + "api/Product/AddProduct",
  GetAllProduct: ParentConfiguration.Parent + "api/Product/GetAllProduct",
  GetProductByID: ParentConfiguration.Parent + "api/Product/GetProductByID",
  GetProductByName: ParentConfiguration.Parent + "api/Product/GetProductByName",
  UpdateProduct: ParentConfiguration.Parent + "api/Product/UpdateProduct",
  ProductMoveToArchive:
    ParentConfiguration.Parent + "api/Product/ProductMoveToArchive",
  GetArchiveProduct:
    ParentConfiguration.Parent + "api/Product/GetArchiveProduct",
  ProductMoveToTrash:
    ParentConfiguration.Parent + "api/Product/ProductMoveToTrash",
  GetTrashProduct: ParentConfiguration.Parent + "api/Product/GetTrashProduct",
  ProductDeletePermenently:
    ParentConfiguration.Parent + "api/Product/ProductDeletePermenently",
  ProductRestore: ParentConfiguration.Parent + "api/Product/ProductRestore",
  TrashProductRestore:
    ParentConfiguration.Parent + "api/Product/TrashProductRestore",
};
