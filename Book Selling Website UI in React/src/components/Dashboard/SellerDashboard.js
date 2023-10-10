import React, { Component } from "react";
import "./SellerDashboard.scss";
import AddProduct from "../Product/AddProduct";
import GetProduct from "../Product/GetProduct";

import FeedbackServices from "../../services/FeedbackServices";
import ProductServices from "../../services/ProductServices";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import HomeIcon from "@material-ui/icons/Home";
import Backdrop from "@material-ui/core/Backdrop";
import Pagination from "@material-ui/lab/Pagination";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import ShopIcon from "@material-ui/icons/Shop";
import DeleteIcon from "@material-ui/icons/Delete";

import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
//Card
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

const feedbackServices = new FeedbackServices();
const productServices = new ProductServices();

const MobileRegex = RegExp(/^[0-9]{11}$/i);
const PinCodeRegex = RegExp(/^[0-9]{7}$/i);
const EmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i
);

export default class SellerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Feedback: [],
      Product: [],
      //
      Message: "",
      //
      NumberOfRecordPerPage: 6,
      PageNumber: 1,

      FeedbackPageNumber: 1,
      //
      TotalPages: 0,
      TotalRecords: 0,

      open: false,
      OpenEdit: false, // Open Editing Booking Model
      OpenLoader: false,
      OpenSnackBar: false,

      OpenSellerHome: true,
      OpenSellerAddProduct: false,
      OpenSellerTrash: false,

      Update: false,
      ShowApplicantInfo: false,
      OpenBookModel: false, //Editing Booking Application
    };
  }

  //
  componentWillMount() {
    console.log("Component will mount calling ...  State : ", this.state);
    this.setState({
      OpenSellerHome:
        localStorage.getItem("OpenSellerHome") === "true" ? true : false,
      OpenSellerAddProduct:
        localStorage.getItem("OpenSellerAddProduct") === "true" ? true : false,
    });

    if (localStorage.getItem("OpenSellerHome") === "true") {
      this.product_Services(this.state.PageNumber);
    }
  }

  product_Services = async (CurrentPage) => {
    console.log("Get Jobs List Calling ... ");
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 5,
    };
    this.setState({ OpenLoader: true });
    productServices
      .GetAllProduct(data)
      .then((data) => {
        console.log("GetAllProduct Data : ", data);
        console.log(
          "Page Count : ",
          Math.ceil(parseFloat(data.data.totalRecords / 5))
        );
        this.setState({
          List: data.data.data
            .filter((X) => X.isActive && !X.isArchive)
            .slice((CurrentPage - 1) * 5, CurrentPage * 5),
          TotalPages: Math.ceil(
            parseFloat(
              data.data.data.filter((X) => X.isActive && !X.isArchive).length /
                5
            )
          ),
          //   PageNumber: data.data.currentPage,
          OpenLoader: false,
          OpenSnackBar: true,
          Message: "Fetch Available Product",
        });
      })
      .catch((error) => {
        console.log("GetAllProduct Error : ", error);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: true,
          Message: "Something Went Wrong",
        });
      });
  };

  handleMenuButton = (e) => {
    console.log("Handle Menu Button Calling ... ");
    this.setState({
      MenuOpen: !this.state.MenuOpen,
    });
  };

  handleOpen = () => {
    console.log("Handle Open Calling ... ");

    this.setState({
      open: true,
      OpenSellerHome: true,
    });
  };

  handleClose = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      open: false,
      Update: false,
      OpenEdit: false,
      OpenBookModel: false,
    });
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  //
  handleOpenHomeNav = async () => {
    console.log("Handle Open List Calling ... ");
    //
    localStorage.setItem("OpenSellerHome", true);
    localStorage.setItem("OpenSellerAddProduct", false);
    localStorage.setItem("OpenSellerTrash", false);

    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    //
    this.setState({
      OpenSellerHome: true,
      OpenSellerAddProduct: false,
      OpenSellerTrash: false,
    });
    //
    this.product_Services(1);
  };

  //
  handleOpenAddProductNav = () => {
    console.log("Handle Add Product Nav Calling ... ");
    //
    localStorage.setItem("OpenSellerHome", false);
    localStorage.setItem("OpenSellerAddProduct", true);
    localStorage.setItem("OpenSellerTrash", false);
    //
    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    //
    this.setState({
      OpenSellerHome: false,
      OpenSellerAddProduct: true,
      OpenSellerTrash: false,
    });
  };

  //
  handleOpenTrashNav = async () => {
    console.log("Handle Open List Calling ... ");
    this.GetTrashList(1);
    //
    localStorage.setItem("OpenSellerHome", false);
    localStorage.setItem("OpenSellerAddProduct", false);
    localStorage.setItem("OpenSellerTrash", true);

    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    //
    this.setState({
      OpenSellerHome: false,
      OpenSellerAddProduct: false,
      OpenSellerTrash: true,
    });
    //
  };

  //
  handleOpenEditProductNav = () => {
    console.log("Handle Edit Product Nav Calling ... ");
    //
    localStorage.setItem("OpenSellerHome", false);
    localStorage.setItem("OpenSellerAddProduct", true);
    //
    this.setState({
      OpenSellerHome: false,
      OpenSellerAddProduct: true,
    });
  };

  handleChangeContact = (e) => {
    const { name, value } = e.target;
    console.log("Regex Match : ", MobileRegex.test(value));
    if (!MobileRegex.test(value)) {
      this.setState({ ContactFlag: true });
    } else {
      this.setState({ ContactFlag: false });
    }
    //

    if (value.toString().length <= 10) {
      this.setState(
        { [name]: value },
        console.log("Name : ", name, "Value : ", value)
      );
      if (value.toString().length === 10) {
        this.setState({ ContactFlag: false });
      }
    }
  };

  handleChangeEmail = (e) => {
    const { name, value } = e.target;
    console.log("Regex Match : ", EmailRegex.test(value));
    if (!EmailRegex.test(value)) {
      this.setState({ EmailIDFlag: true });
    } else {
      this.setState({ EmailIDFlag: false });
    }
    this.setState(
      { [name]: value },
      console.log("Name : ", name, "Value : ", value)
    );
  };

  handleChangePinCode = (e) => {
    const { name, value } = e.target;
    console.log("Regex Match : ", PinCodeRegex.test(value));
    if (!PinCodeRegex.test(value)) {
      this.setState(
        { [name]: value },
        console.log("Name : ", name, "Value : ", value)
      );
    }
  };

  handleDeleteFeedback = async (ID) => {
    console.log("handleDeleteFeedback Calling ..... ID :", ID);
    // let data = { ID: ID };
    await feedbackServices
      .DeleteFeedback(ID)
      .then((data) => {
        console.log("Feedback Data : ", data);
        this.setState({
          OpenSnackBar: true,
          Open: false,
          Message: data.data.message,
        });
        this.GetFeedBack(this.state.FeedbackPageNumber);
      })
      .catch((error) => {
        console.log("Feedback Error : ", error);
        this.setState({
          OpenSnackBar: true,

          Open: false,
          Message: "Something Went Wrong.",
        });
        this.GetFeedBack(this.state.FeedbackPageNumber);
      });
  };

  handlePaging = async (e, value) => {
    let state = this.state;
    console.log("Current Page : ", value);

    this.setState({
      PageNumber: value,
    });

    if (state.OpenSellerHome) {
      await this.product_Services(value);
    }
  };

  SignOut = async () => {
    await localStorage.removeItem("Admin_token");
    await localStorage.removeItem("Admin_UserID");
    await localStorage.removeItem("OpenSellerHome");
    await localStorage.removeItem("OpenSellerAddProduct");
    //
    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    this.props.history.push("/SignIn");
  };

  handleEditProduct = (data) => {
    debugger;
    let self = this;
    console.log("Data : ", data);
    localStorage.setItem("IsEdit", true);
    localStorage.setItem("productDataObject", JSON.stringify(data));
    self.handleOpenEditProductNav();
  };

  ProductMoveToTrash = async (productID) => {
    this.setState({ OpenLoader: true });
    let data = {
      productID: productID,
    };
    await productServices
      .ProductMoveToTrash(data)
      .then((data) => {
        debugger;
        console.log("ProductMoveToTrash Data : ", data);
        this.setState({
          Message: data.data.message,
          OpenSnackBar: true,
          OpenLoader: false,
        });
        //setMessage(data.data.message);
        //setOpenSnackBar(true);
        //setOpenLoader(false);
        this.product_Services(1);
      })
      .catch((error) => {
        console.log("ProductMoveToTrash Error : ", error);
        this.setState({
          Message: "Something went wrong",
          OpenSnackBar: true,
          OpenLoader: false,
        });
        this.product_Services(1);
      });
  };

  OpenHomeNav = () => {
    // debugger;
    let self = this;
    return (
      <div className="HomePage-SubContainer-Body">
        <div className="HomePage-SubContainer-Body-SubBody1">
          {Array.isArray(this.state.List) && this.state.List.length > 0
            ? this.state.List.map(function (data, index) {
                console.log("Get Product Data : ", data);
                return (
                  <>
                    {!data.isArchive && data.isActive ? (
                      <Card
                        className=""
                        style={{ maxWidth: 350, margin: 15 }}
                        key={index}
                      >
                        <CardActionArea>
                          <CardMedia
                            style={{ height: 180, width: 260 }}
                            image={data.productImageUrl}
                            title="Contemplative Reptile"
                          />

                          <CardContent
                            style={{
                              width: 228,
                              height: 130,
                            }}
                          >
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              {data.productName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                              style={{
                                height: 80,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {data.productDetails}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                              style={{
                                height: 40,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: 600,
                                color: "blue",
                              }}
                            >
                              <>
                                {data.quantity !== 0 ? (
                                  <> Available : {data.quantity}</>
                                ) : (
                                  <>Not Available</>
                                )}
                              </>
                              &nbsp; &nbsp;
                              <>Price : {data.productPrice} &#8377;</>
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          <Button
                            size="small"
                            color="primary"
                            style={{ width: "50%" }}
                            onClick={() => {
                              self.handleEditProduct(data);
                            }}
                          >
                            <EditIcon style={{ color: "black" }} />
                          </Button>
                          <Button
                            size="small"
                            color="primary"
                            style={{ width: "50%" }}
                            onClick={() => {
                              self.ProductMoveToTrash(data.productID);
                            }}
                          >
                            <DeleteIcon style={{ color: "black" }} />
                          </Button>
                        </CardActions>
                      </Card>
                    ) : (
                      <></>
                    )}
                  </>
                );
              })
            : null}
        </div>
        <div className="HomePage-SubContainer-Body-SubBody2">
          <Pagination
            count={this.state.TotalPages}
            Page={this.state.PageNumber}
            onChange={this.handlePaging}
            variant="outlined"
            shape="rounded"
            color="secondary"
          />
        </div>
      </div>
    );
  };

  OpenAddProductNav = () => {
    return (
      <AddProduct
        handleOpenHomeNav={() => {
          this.handleOpenHomeNav();
        }}
      />
    );
  };

  //
  OpenTrashNav = () => {
    return (
      <GetProduct
        List={this.state.Product}
        State="Trash"
        TotalPages={this.state.TotalPages}
        PageNumber={this.state.PageNumber}
        handlePaging={this.handlePaging}
        GetTrashList={this.GetTrashList}
        productServices={this.GetTrashList}
      />
    );
  };

  //
  GetTrashList = async (CurrentPage) => {
    console.log("Get Jobs List Calling ... ");
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 10,
    };
    debugger;
    this.setState({ OpenLoader: true, Product: [] });
    await productServices
      .GetAllProduct(data)
      .then((data) => {
        debugger;
        if (data.data.data.filter((X) => !X.isActive && !X.isArchive)) {
          this.setState({
            Product: data.data.data
              .filter((X) => !X.isActive && !X.isArchive)
              .slice((CurrentPage - 1) * 4, CurrentPage * 4)
              .reverse(),
            TotalPages: Math.ceil(
              parseFloat(
                data.data.data.filter((X) => !X.isActive && !X.isArchive)
                  .length / 4
              )
            ),
            PageNumber: data.data.currentPage,
            OpenLoader: false,
            OpenSnackBar: true,
            Message: "Fetch Available Product",
            // Message: data.data.message,
          });
        }
      })
      .catch((error) => {
        console.log("GetAllProduct Error : ", error);
        this.setState({ OpenLoader: false });
      });
  };

  render() {
    let state = this.state;
    let self = this;
    console.log("state : ", state);
    return (
      <div className="SellerDashboard-Container">
        <div className="Sub-Container">
          <div className="Header" style={{ height: "7.5%" }}>
            <AppBar
              position="static"
              style={{ backgroundColor: "#0000ff", color: "white" }}
            >
              <Toolbar>
                <Typography
                  variant="h6"
                  style={{
                    flexGrow: 3,
                    display: "flex",
                    padding: "5px 0 0 200px",
                    boxSizing: "border-box",
                  }}
                >
                  Book Selling Mart &nbsp;
                  <div style={{ margin: "3px 0 0 0" }}>
                    <ShopIcon />
                  </div>
                </Typography>
                <Typography variant="h6" style={{ margin: "0 500px 0 0" }}>
                  Seller Dashboard
                </Typography>
                <Button
                  color="inherit"
                  onClick={() => {
                    this.SignOut();
                  }}
                >
                  LogOut
                </Button>
              </Toolbar>
            </AppBar>
          </div>
          <div className="Body">
            <div className="Sub-Body">
              <div className="SubBody11">
                <div
                  className={state.OpenSellerHome ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenHomeNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <HomeIcon style={{ color: "white" }} />
                  </IconButton>
                  <div className="NavButtonText">Home</div>
                </div>

                <div
                  className={
                    state.OpenSellerAddProduct ? "NavButton1" : "NavButton2"
                  }
                  onClick={this.handleOpenAddProductNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <AddBoxIcon style={{ color: "white" }} />
                  </IconButton>
                  <div className="NavButtonText">Add Product</div>
                </div>

                <div
                  className={
                    state.OpenSellerTrash ? "NavButton1" : "NavButton2"
                  }
                  onClick={this.handleOpenTrashNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <DeleteIcon style={{ color: "white" }} />
                  </IconButton>
                  <div className="NavButtonText">Trash</div>
                </div>
              </div>
              <div className="SubBody21">
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    background: "#202020af",
                  }}
                >
                  {state.OpenSellerHome ? (
                    this.OpenHomeNav()
                  ) : state.OpenSellerAddProduct ? (
                    this.OpenAddProductNav()
                  ) : state.OpenSellerTrash ? (
                    this.OpenTrashNav()
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Backdrop
          style={{ zIndex: "1", color: "#fff" }}
          open={this.state.OpenLoader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={state.OpenSnackBar}
          autoHideDuration={2000}
          onClose={this.handleSnackBarClose}
          message={state.Message}
          action={
            <React.Fragment>
              <Button
                color="secondary"
                size="small"
                onClick={this.handleSnackBarClose}
              >
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleSnackBarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  }
}
