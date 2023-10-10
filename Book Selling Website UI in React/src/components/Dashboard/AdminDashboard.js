import React, { Component } from "react";
import "./AdminDashboard.css";
import AddProduct from "../Product/AddProduct";
import GetProduct from "../Product/GetProduct";
import FeedbackServices from "../../services/FeedbackServices";
import ProductServices from "../../services/ProductServices";
import AuthServices from "../../services/AuthServices";
import CartServices from "../../services/CartServices";
import Rating from "@material-ui/lab/Rating";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import ViewListIcon from "@material-ui/icons/ViewList";
import ArchiveIcon from "@material-ui/icons/Archive";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Pagination from "@material-ui/lab/Pagination";
import FeedbackIcon from "@material-ui/icons/Feedback";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import ShopIcon from "@material-ui/icons/Shop";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

//Table Library
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

//Card
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

const feedbackServices = new FeedbackServices();
const productServices = new ProductServices();
const authServices = new AuthServices();
const cartServices = new CartServices();

const MobileRegex = RegExp(/^[0-9]{11}$/i);
const PinCodeRegex = RegExp(/^[0-9]{7}$/i);
const EmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i
);

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Feedback: [],
      Product: [],
      //

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

      OpenHome: true,
      OpenAddProduct: false,
      OpenArchive: false,
      OpenTrash: false,
      OpenCustomerList: false,
      OpenOrderList: false,
      OpenFeedBack: false,

      Update: false,
      ShowApplicantInfo: false,
      OpenBookModel: false, //Editing Booking Application
    };
  }

  //
  componentWillMount() {
    console.log("Component will mount calling ...  State : ", this.state);
    this.setState({
      OpenHome: localStorage.getItem("OpenHome") === "true" ? true : false,
      OpenAddProduct:
        localStorage.getItem("OpenAddProduct") === "true" ? true : false,
      OpenArchive:
        localStorage.getItem("OpenArchive") === "true" ? true : false,
      OpenTrash: localStorage.getItem("OpenTrash") === "true" ? true : false,
      OpenCustomerList:
        localStorage.getItem("OpenCustomerList") === "true" ? true : false,
      OpenOrderList:
        localStorage.getItem("OpenOrderList") === "true" ? true : false,
      OpenFeedBack:
        localStorage.getItem("OpenFeedBack") === "true" ? true : false,
    });

    if (localStorage.getItem("OpenHome") === "true") {
      this.productServices(this.state.PageNumber);
    } else if (localStorage.getItem("OpenArchive") === "true") {
      this.GetArchiveList(this.state.PageNumber);
    } else if (localStorage.getItem("OpenTrash") === "true") {
      this.GetTrashList(this.state.PageNumber);
    } else if (localStorage.getItem("OpenCustomerList") === "true") {
      this.GetCustomerList(this.state.PageNumber);
    } else if (localStorage.getItem("OpenOrderList") === "true") {
      this.GetAllOrderList(this.state.PageNumber);
    } else if (localStorage.getItem("OpenFeedBack") === "true") {
      this.GetFeedBack(this.state.PageNumber);
    }
  }

  //
  productServices = async (CurrentPage) => {
    console.log("Get Jobs List Calling ... ");
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 10,
    };
    this.setState({ OpenLoader: true, Product: [] });
    await productServices
      .GetAllProduct(data)
      .then((data) => {
        console.log("GetAllProduct Data : ", data.data.data);
        console.log(
          "Data : ",
          data.data.data.filter((X) => X.isActive && !X.isArchive)
        );
        console.log(
          "Count : ",
          data.data.data.filter((X) => X.isActive && !X.isArchive).length
        );
        console.log(
          "Page Count : ",
          Math.ceil(
            parseFloat(
              data.data.data.filter((X) => X.isActive && !X.isArchive).length /
                4
            )
          )
        );
        this.setState({
          Product: data.data.data
            .filter((X) => X.isActive && !X.isArchive)
            .slice((CurrentPage - 1) * 4, CurrentPage * 4)
            .reverse(),
          TotalPages: Math.ceil(
            parseFloat(
              data.data.data.filter((X) => X.isActive && !X.isArchive).length /
                4
            )
          ),
          PageNumber: data.data.currentPage,
          OpenLoader: false,
          OpenSnackBar: true,
          Message: "Fetch Available Product",
          // Message: data.data.message,
        });
      })
      .catch((error) => {
        console.log("GetAllProduct Error : ", error);
        this.setState({ OpenLoader: false });
      });
  };

  //
  GetArchiveList = async (CurrentPage) => {
    console.log("Get Jobs List Calling ... ");
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 10,
    };
    this.setState({ OpenLoader: true, Product: [] });
    await productServices
      .GetAllProduct(data)
      .then((data) => {
        console.log("GetAllProduct Data : ", data.data.data);
        console.log(
          "Data : ",
          data.data.data.filter((X) => X.isActive && X.isArchive)
        );
        console.log(
          "Count : ",
          data.data.data.filter((X) => X.isActive && X.isArchive).length
        );
        console.log(
          "Page Count : ",
          Math.ceil(
            parseFloat(
              data.data.data.filter((X) => X.isActive && X.isArchive).length / 4
            )
          )
        );
        this.setState({
          Product: data.data.data
            .filter((X) => X.isActive && X.isArchive)
            .slice((CurrentPage - 1) * 4, CurrentPage * 4)
            .reverse(),
          TotalPages: Math.ceil(
            parseFloat(
              data.data.data.filter((X) => X.isActive && X.isArchive).length / 4
            )
          ),
          PageNumber: data.data.currentPage,
          OpenLoader: false,
          OpenSnackBar: true,
          Message: "Fetch Available Product",
          // Message: data.data.message,
        });
      })
      .catch((error) => {
        console.log("GetAllProduct Error : ", error);
        this.setState({ OpenLoader: false });
      });
  };

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

  //
  GetCustomerList = (CurrentPage) => {
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 8,
    };
    this.setState({ OpenLoader: true, Product: [] });
    authServices
      .CustomerList(data)
      .then((data) => {
        console.log("GetCustomerList Data : ", data.data.data);
        console.log(
          "Length : ",
          Math.ceil(
            parseFloat(
              data.data.data.filter((x) => x.Role === "customer").length / 10
            )
          )
        );
        this.setState({
          Product: data.data.data
            .filter((x) => x.Role === "customer")
            .slice((CurrentPage - 1) * 10, CurrentPage * 10)
            .reverse(),
          TotalPages: Math.ceil(
            parseFloat(
              data.data.data.filter((x) => x.Role === "customer").length / 10
            )
          ),
          OpenLoader: false,
          OpenSnackBar: true,
          Message: data.data.message,
        });
      })
      .catch((error) => {
        console.log("GetCustomerList Error : ", error);
        this.setState({ OpenLoader: false });
      });
  };

  //
  GetAllOrderList = async (CurrentPage) => {
    console.log("Get My Order List Calling ... ");
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 8,
      userID: -1,
    };
    this.setState({ OpenLoader: true, Product: [] });
    cartServices
      .GetAllOrderProduct(data)
      .then((data) => {
        console.log("GetMyOrderList Data : ", data);
        this.setState({
          Product: data.data.data
            .filter((X) => X.isOrder)
            .slice((CurrentPage - 1) * 10, CurrentPage * 10)
            .reverse(),
          TotalPages: Math.ceil(
            parseFloat(data.data.data.filter((X) => X.isOrder).length / 10)
          ),
          OpenLoader: false,
          OpenSnackBar: true,
          Message: data.data.message,
        });
      })
      .catch((error) => {
        console.log("GetMyOrderList Error : ", error);
        this.setState({ OpenLoader: false });
      });
  };

  GetFeedBack = async (CurrentPage) => {
    // debugger;
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 8,
    };
    this.setState({ OpenLoader: true, Product: [] });
    await feedbackServices
      .GetFeedbacks(data)
      .then((data) => {
        console.log("Feedback Data : ", data);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: true,
          Open: false,
          Message: data.data.message,
          Product: data.data.data
            .slice((CurrentPage - 1) * 10, CurrentPage * 10)
            .reverse(),
          TotalPages: Math.ceil(parseFloat(data.data.data.length / 10)),
        });
      })
      .catch((error) => {
        console.log("Feedback Error : ", error);
        this.setState({
          OpenSnackBar: true,
          OpenLoader: false,
          Open: false,
          Message: "Something Went Wrong.",
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
      OpenHome: true,
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

    await this.productServices(
      this.state.PageNumber == 0 ? 1 : this.state.PageNumber
    );

    //
    localStorage.setItem("OpenHome", true);
    localStorage.setItem("OpenAddProduct", false);
    localStorage.setItem("OpenArchive", false);
    localStorage.setItem("OpenTrash", false);
    localStorage.setItem("OpenCustomerList", false);
    localStorage.setItem("OpenOrderList", false);
    localStorage.setItem("OpenFeedBack", false);
    //
    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    //
    this.setState({
      PageNumber: 1,
      OpenHome: true,
      OpenAddProduct: false,
      OpenArchive: false,
      OpenTrash: false,
      OpenCustomerList: false,
      OpenOrderList: false,
      OpenFeedBack: false,
    });
    //
  };

  //
  handleOpenAddProductNav = () => {
    console.log("Handle Add Product Nav Calling ... ");
    //
    localStorage.setItem("OpenHome", false);
    localStorage.setItem("OpenAddProduct", true);
    localStorage.setItem("OpenArchive", false);
    localStorage.setItem("OpenTrash", false);
    localStorage.setItem("OpenCustomerList", false);
    localStorage.setItem("OpenOrderList", false);
    localStorage.setItem("OpenFeedBack", false);
    //
    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    //
    this.setState({
      PageNumber: 1,
      OpenHome: false,
      OpenAddProduct: true,
      OpenArchive: false,
      OpenTrash: false,
      OpenCustomerList: false,
      OpenOrderList: false,
      OpenFeedBack: false,
    });
  };

  //
  handleOpenEditProductNav = () => {
    console.log("Handle Add Product Nav Calling ... ");
    //
    localStorage.setItem("OpenHome", false);
    localStorage.setItem("OpenAddProduct", true);
    localStorage.setItem("OpenArchive", false);
    localStorage.setItem("OpenTrash", false);
    localStorage.setItem("OpenCustomerList", false);
    localStorage.setItem("OpenOrderList", false);
    localStorage.setItem("OpenFeedBack", false);

    //
    this.setState({
      PageNumber: 1,
      OpenHome: false,
      OpenAddProduct: true,
      OpenArchive: false,
      OpenTrash: false,
      OpenCustomerList: false,
      OpenOrderList: false,
      OpenFeedBack: false,
    });
  };

  //
  handleOpenArchiveNav = async () => {
    console.log("Handle Open Archive Nav Calling ... ");

    await this.GetArchiveList(
      this.state.PageNumber == 0 ? 1 : this.state.PageNumber
    );

    localStorage.setItem("OpenHome", false);
    localStorage.setItem("OpenAddProduct", false);
    localStorage.setItem("OpenArchive", true);
    localStorage.setItem("OpenTrash", false);
    localStorage.setItem("OpenCustomerList", false);
    localStorage.setItem("OpenOrderList", false);
    localStorage.setItem("OpenFeedBack", false);
    //
    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    //
    this.setState({
      PageNumber: 1,
      OpenHome: false,
      OpenAddProduct: false,
      OpenArchive: true,
      OpenTrash: false,
      OpenCustomerList: false,
      OpenOrderList: false,
      OpenFeedBack: false,
    });

    // this.productServices(
    //   this.state.PageNumber == 0 ? 1 : this.state.PageNumber
    // );
  };

  //
  handleOpenTrashNav = async () => {
    console.log("Handle Open Trash Nav Calling...");

    await this.GetTrashList(
      this.state.PageNumber == 0 ? 1 : this.state.PageNumber
    );

    localStorage.setItem("OpenHome", false);
    localStorage.setItem("OpenAddProduct", false);
    localStorage.setItem("OpenArchive", false);
    localStorage.setItem("OpenTrash", true);
    localStorage.setItem("OpenCustomerList", false);
    localStorage.setItem("OpenOrderList", false);
    localStorage.setItem("OpenFeedBack", false);
    //
    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    //
    this.setState({
      PageNumber: 1,
      OpenHome: false,
      OpenAddProduct: false,
      OpenArchive: false,
      OpenTrash: true,
      OpenCustomerList: false,
      OpenOrderList: false,
      OpenFeedBack: false,
    });

    // this.productServices(
    //   this.state.PageNumber == 0 ? 1 : this.state.PageNumber
    // );
  };

  //
  handleOpenCustomerListNav = () => {
    console.log("Handle Open Customer List Nav Calling...");
    //
    localStorage.setItem("OpenHome", false);
    localStorage.setItem("OpenAddProduct", false);
    localStorage.setItem("OpenArchive", false);
    localStorage.setItem("OpenTrash", false);
    localStorage.setItem("OpenCustomerList", true);
    localStorage.setItem("OpenOrderList", false);
    localStorage.setItem("OpenFeedBack", false);
    //
    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    //
    this.setState({
      PageNumber: 1,
      OpenHome: false,
      OpenAddProduct: false,
      OpenArchive: false,
      OpenTrash: false,
      OpenCustomerList: true,
      OpenOrderList: false,
      OpenFeedBack: false,
    });

    this.GetCustomerList(this.state.PageNumber);
  };

  //
  handleOpenOrderListNav = () => {
    console.log("Handle Open Customer List Nav Calling...");
    //
    localStorage.setItem("OpenHome", false);
    localStorage.setItem("OpenAddProduct", false);
    localStorage.setItem("OpenArchive", false);
    localStorage.setItem("OpenTrash", false);
    localStorage.setItem("OpenCustomerList", false);
    localStorage.setItem("OpenOrderList", true);
    localStorage.setItem("OpenFeedBack", false);
    //
    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    //
    this.setState({
      PageNumber: 1,
      OpenHome: false,
      OpenAddProduct: false,
      OpenArchive: false,
      OpenTrash: false,
      OpenCustomerList: false,
      OpenOrderList: true,
      OpenFeedBack: false,
    });

    this.GetAllOrderList(this.state.PageNumber);
  };

  //
  handleOpenFeedBackNav = (e) => {
    console.log("Handle FeedBack Open Calling...");
    //
    localStorage.setItem("OpenHome", false);
    localStorage.setItem("OpenAddProduct", false);
    localStorage.setItem("OpenArchive", false);
    localStorage.setItem("OpenTrash", false);
    localStorage.setItem("OpenCustomerList", false);
    localStorage.setItem("OpenOrderList", false);
    localStorage.setItem("OpenFeedBack", true);
    //
    localStorage.setItem("IsEdit", false);
    localStorage.setItem("productDataObject", null);
    //
    this.setState({
      // PageNumber: 1,
      OpenHome: false,
      OpenAddProduct: false,
      OpenArchive: false,
      OpenTrash: false,
      OpenCustomerList: false,
      OpenOrderList: false,
      OpenFeedBack: true,
    });

    this.GetFeedBack(this.state.PageNumber);
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

    if (state.OpenHome) {
      await this.productServices(value);
    } else if (state.OpenArchive) {
      await this.GetArchiveList(value);
    } else if (state.OpenTrash) {
      await this.GetTrashList(value);
    } else if (state.OpenCustomerList) {
      await this.GetCustomerList(value);
    } else if (state.OpenOrderList) {
      await this.GetAllOrderList(value);
    } else if (state.OpenFeedBack) {
      await this.GetFeedBack(value);
    }
  };

  SignOut = async () => {
    await localStorage.removeItem("Admin_token");
    await localStorage.removeItem("Admin_UserID");
    await localStorage.removeItem("OpenHome");
    await localStorage.removeItem("OpenAddProduct");
    await localStorage.removeItem("OpenArchive");
    await localStorage.removeItem("OpenTrash");
    await localStorage.removeItem("OpenCustomerList");
    await localStorage.removeItem("OpenOrderList");
    await localStorage.removeItem("OpenFeedBack");

    this.props.history.push("/SignIn");
  };

  //
  OpenHomeNav = () => {
    // debugger;
    return (
      <GetProduct
        List={this.state.Product}
        State="Home"
        TotalPages={this.state.TotalPages}
        PageNumber={this.state.PageNumber}
        handlePaging={this.handlePaging}
        productServices={this.productServices}
        handleOpenEditProductNav={this.handleOpenEditProductNav}
      />
    );
  };

  //
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
  OpenFeedBackNav = () => {
    return (
      <TableContainer
        component={Paper}
        style={{
          display: "flex",
          justifyContent: "flex-Start",
          alignItems: "flex-Start",
          margin: 10,
          boxSizing: "border-box",
          width: "98.5%",
          height: "90%",
          // background: "#202020af",
        }}
      >
        <Table
          aria-label="customized table"
          style={{ height: "fit-Content", width: "100%" }}
        >
          <TableHead>
            <TableRow
              style={{
                display: "flex",
                minHeight: "50px",
                flex: 9,
              }}
            >
              <div className="Header" style={{ flex: 0.7 }}>
                FeedBack ID
              </div>
              <div className="Header" style={{ flex: 2 }}>
                FeedBack User
              </div>
              <div className="Header" style={{ width: 700 }}>
                FeedBack
              </div>
              <div className="Header" style={{ flex: 0.5 }}></div>
            </TableRow>
          </TableHead>
          <TableBody style={{ height: "fit-content" }}>
            {this.handleFeedbackList()}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  //
  handleFeedbackList = (e) => {
    let self = this;
    return Array.isArray(this.state.Product) && this.state.Product.length > 0
      ? this.state.Product.map(function (data, index) {
          return (
            <TableRow
              key={index}
              style={{
                height: "50px",
                display: "flex",
                borderBottom: "0.5px solid lightgray",
                flex: 9,
              }}
            >
              <div className="Row" style={{ flex: 0.7 }}>
                {data.feedbackId}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {data.userName}
              </div>
              <div
                className="Row"
                style={{
                  width: "700px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {data.feedback}
              </div>
              <div className="Row" style={{ flex: 0.5 }}>
                <IconButton
                  variant="outlined"
                  style={{ color: "black" }}
                  onClick={() => {
                    self.handleDeleteFeedback(data.feedbackId);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </TableRow>
          );
        })
      : null;
  };

  //
  OpenArchiveNav = () => {
    console.log("OpenArchiveNav Calling....");
    return (
      <GetProduct
        List={this.state.Product}
        State="Archive"
        TotalPages={this.state.TotalPages}
        PageNumber={this.state.PageNumber}
        handlePaging={this.handlePaging}
        GetArchiveList={this.GetArchiveList}
        productServices={this.productServices}
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
  OpenCustomerListNav = () => {
    return (
      <TableContainer
        component={Paper}
        style={{
          display: "flex",
          justifyContent: "flex-Start",
          alignItems: "flex-start",
          margin: 10,
          width: "98.5%",
          height: "90%",
          // background: "#202020af",
        }}
      >
        <Table
          aria-label="customized table"
          style={{ height: "fit-Content", width: "100%" }}
        >
          <TableHead>
            <TableRow
              style={{
                display: "flex",
                minHeight: "50px",
                flex: 8,
              }}
            >
              {/* <div className="Header" style={{ flex: 1 }}>
                Customer ID
              </div> */}
              <div className="Header" style={{ flex: 2 }}>
                UserName
              </div>
              <div className="Header" style={{ flex: 2 }}>
                Full Name
              </div>
              <div className="Header" style={{ flex: 2 }}>
                Email ID
              </div>
              <div className="Header" style={{ flex: 2 }}>
                Mobile Number
              </div>
            </TableRow>
          </TableHead>
          <TableBody style={{ height: "fit-content" }}>
            {this.handleCustomerList()}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  //
  handleCustomerList = (e) => {
    let self = this;
    return Array.isArray(this.state.Product) && this.state.Product.length > 0
      ? this.state.Product.map(function (data, index) {
          return (
            <TableRow
              key={index}
              style={{
                height: "50px",
                display: "flex",
                borderBottom: "0.5px solid lightgray",
                flex: 8,
              }}
            >
              {/* <div className="Row" style={{ flex: 1 }}>
                {data.id == -1 ? <>NA</> : <>{data.id}</>}
              </div> */}
              <div className="Row" style={{ flex: 2 }}>
                {data.userName}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {/* {data.fullName} */}
                {data.fullName == "" ? <>NA</> : <>{data.fullName}</>}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {/* {data.emailID} */}
                {data.emailID == "" ? <>NA</> : <>{data.emailID}</>}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {/* {data.mobileNumber} */}
                {data.mobileNumber == "" ? <>NA</> : <>{data.mobileNumber}</>}
              </div>
            </TableRow>
          );
        })
      : null;
  };

  //
  OpenOrderListNav = () => {
    return (
      <TableContainer
        component={Paper}
        style={{
          display: "flex",
          justifyContent: "flex-Start",
          alignItems: "flex-Start",
          margin: 10,
          width: "98.5%",
          height: "90%",
          background: "white",
        }}
      >
        <Table
          aria-label="customized table"
          style={{ height: "fit-Content", width: "100%" }}
        >
          <TableHead>
            <TableRow
              style={{
                display: "flex",
                minHeight: "50px",
                flex: 10,
              }}
            >
              <div className="Header" style={{ flex: 1 }}>
                Order ID
              </div>
              <div className="Header" style={{ flex: 2 }}>
                Customer Name
              </div>
              <div className="Header" style={{ flex: 2 }}>
                Product Name
              </div>
              <div className="Header" style={{ flex: 2 }}>
                Product Type
              </div>
              <div className="Header" style={{ flex: 1 }}>
                Product Price
              </div>
              <div className="Header" style={{ flex: 2 }}>
                Rating
              </div>
            </TableRow>
          </TableHead>
          <TableBody style={{ height: "fit-content" }}>
            {this.handleOrderList()}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  //
  handleOrderList = (e) => {
    let self = this;
    return Array.isArray(this.state.Product) && this.state.Product.length > 0
      ? this.state.Product.map(function (data, index) {
          return (
            <TableRow
              key={index}
              style={{
                height: "50px",
                display: "flex",
                borderBottom: "0.5px solid lightgray",
                flex: 10,
              }}
            >
              <div className="Row" style={{ flex: 1 }}>
                {data.cartID}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {data.fullName}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {data.productName}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {data.productType}
              </div>
              <div className="Row" style={{ flex: 1 }}>
                {data.productPrice}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                <Rating name="Rating" value={data.rating} />
                {/* {data.productPrice} */}
              </div>
            </TableRow>
          );
        })
      : null;
  };

  render() {
    let state = this.state;
    let self = this;
    console.log("state : ", state);
    return (
      <div className="AdminDashboard-Container">
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
                  Admin Dashboard
                </Typography>
                {/* <div className="search" style={{ flexGrow: 0.5 }}>
                  <div className="searchIcon">
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search Product"
                    classes={{
                      root: "inputRoot",
                      input: "inputInput",
                    }}
                    inputProps={{ "aria-label": "search" }}
                  />
                </div> */}
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
                  className={state.OpenHome ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenHomeNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <HomeIcon style={{ color: "white" }} />
                  </IconButton>
                  <div className="NavButtonText">Home</div>
                </div>

                <div
                  className={state.OpenAddProduct ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenAddProductNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <AddBoxIcon style={{ color: "white" }} />
                  </IconButton>
                  <div className="NavButtonText">Add Product</div>
                </div>
                <div
                  className={state.OpenArchive ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenArchiveNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <ArchiveIcon style={{ color: "white" }} />
                  </IconButton>
                  <div className="NavButtonText">Archive</div>
                </div>
                <div
                  className={state.OpenTrash ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenTrashNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <DeleteIcon style={{ color: "white" }} />
                  </IconButton>
                  <div className="NavButtonText">Trash</div>
                </div>
                <div
                  className={
                    state.OpenCustomerList ? "NavButton1" : "NavButton2"
                  }
                  onClick={this.handleOpenCustomerListNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <PeopleAltIcon style={{ color: "white" }} />
                  </IconButton>

                  <div className="NavButtonText">Customer List</div>
                </div>
                <div
                  className={state.OpenOrderList ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenOrderListNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <ViewListIcon style={{ color: "white" }} />
                  </IconButton>
                  <div className="NavButtonText">Order List</div>
                </div>
                <div
                  className={state.OpenFeedBack ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenFeedBackNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <FeedbackIcon style={{ color: "white" }} />
                  </IconButton>

                  <div className="NavButtonText">FeedBack</div>
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
                  {state.OpenHome ? (
                    this.OpenHomeNav()
                  ) : state.OpenAddProduct ? (
                    this.OpenAddProductNav()
                  ) : state.OpenFeedBack ? (
                    this.OpenFeedBackNav()
                  ) : state.OpenArchive ? (
                    this.OpenArchiveNav()
                  ) : state.OpenTrash ? (
                    this.OpenTrashNav()
                  ) : state.OpenCustomerList ? (
                    this.OpenCustomerListNav()
                  ) : state.OpenOrderList ? (
                    this.OpenOrderListNav()
                  ) : (
                    <></>
                  )}
                  {state.OpenCustomerList ||
                  state.OpenOrderList ||
                  state.OpenFeedBack ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Pagination
                        count={this.state.TotalPages}
                        Page={this.state.PageNumber}
                        onChange={this.handlePaging}
                        variant="outlined"
                        shape="rounded"
                        color="secondary"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <Modal
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  open={this.state.open}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={this.state.open}>
                    <div
                      style={{
                        backgroundColor: "white",
                        boxShadow: "5",
                        padding: "2px 4px 3px",
                        width: "1200px",
                        height: "600px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      {state.ShowApplicantInfo ? (
                        <div
                          style={{
                            backgroundColor: "white",
                            boxShadow: "5",
                            padding: "2px 4px 3px",
                            width: "1000px",
                            height: "600px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "Roboto",
                              fontWeight: 500,
                              fontSize: 20,
                              color: "red",
                            }}
                          >
                            Application ID : {state.ApplicationID}
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div>
                              <div className="Input-Field">
                                <div className="Text">Job ID</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.JobID}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Job Name</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.JobName}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Name</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.Name}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Contact</div>

                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.Contact}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">EmailID</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.EmailID}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Address</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.Address}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Work Experience</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.WorkExperience}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Date Of Birth</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.DateOfBirth}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Passing Year</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.PassingYear}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                className="Input-Field"
                                style={{ margin: "46px 0" }}
                              ></div>
                              <div className="Input-Field">
                                <div className="Text">College Name</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.CollegeName}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Degree</div>

                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.Degree}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Current Status</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.CurrentStatus}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Skill</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.Skill}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Age</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.Age}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">Gender</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.Gender}
                                </div>
                              </div>
                              <div className="Input-Field">
                                <div className="Text">PinCode</div>
                                <div
                                  style={{
                                    color: "blue",
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {state.Pincode}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="Input-Field"
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="secondary"
                              component="span"
                              style={{ margin: "10px 10px 0 0" }}
                              onClick={() => {
                                this.handleDeleteApplication(
                                  state.ApplicationID
                                );
                              }}
                            >
                              Reject Application
                            </Button>
                            <Button
                              variant="outlined"
                              style={{ margin: "10px 0 0 10px" }}
                              onClick={this.handleClose}
                            >
                              Cancle
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="Note">
                            Alert &nbsp;
                            <ErrorIcon style={{ color: "red" }} /> &nbsp;: This
                            Setting Reset Your All WebSite Data
                          </div>
                          <div className="Setting">
                            <div className="AcRoom-Setting">
                              <div className="Title">Ac Room</div>
                              <div className="Input-Field">
                                <div className="Text">No. Of Total Room</div>
                                <TextField
                                  autoComplete="off"
                                  error={state.TotalRoomFlag}
                                  className="Text-Input"
                                  label="Total Room"
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  name="TotalRoom"
                                  value={state.TotalRoom}
                                  onChange={this.handleChanges}
                                />
                              </div>
                              <div className="Input-Field">
                                <div className="Text">No. Of Ac Room</div>
                                <TextField
                                  error={state.AcRoomFlag}
                                  autoComplete="off"
                                  className="Text-Input"
                                  label="Ac Room"
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  name="AcRoom"
                                  value={state.AcRoom}
                                  onChange={this.handleChanges}
                                />
                              </div>
                              <div className="Input-Field">
                                <div className="Text">
                                  No. Of Single Bed Room
                                </div>
                                <TextField
                                  error={state.NoOfAcSingleBedRoomFlag}
                                  autoComplete="off"
                                  className="Text-Input"
                                  label="No. Of Sigle Bed Room"
                                  variant="outlined"
                                  size="small"
                                  name="NoOfAcSingleBedRoom"
                                  value={state.NoOfAcSingleBedRoom}
                                  onChange={this.handleChanges}
                                />
                              </div>
                              <div className="Input-Field">
                                <div className="Text">
                                  Single Bed Room Price / Day
                                </div>
                                <TextField
                                  autoComplete="off"
                                  className="Text-Input"
                                  label="Price"
                                  variant="outlined"
                                  size="small"
                                  name="AcSingleBedRoomPrice"
                                  value={state.AcSingleBedRoomPrice}
                                  onChange={this.handleChanges}
                                />
                              </div>
                              <div className="Input-Field">
                                <div className="Text">
                                  No. Of Double Bed Room
                                </div>
                                <TextField
                                  error={state.NoOfAcDoubleBedRoomFlag}
                                  autoComplete="off"
                                  className="Text-Input"
                                  label="No. Of Room"
                                  variant="outlined"
                                  size="small"
                                  name="NoOfAcDoubleBedRoom"
                                  value={state.NoOfAcDoubleBedRoom}
                                  onChange={this.handleChanges}
                                />
                              </div>
                              <div className="Input-Field">
                                <div className="Text">
                                  Double Bed Room Price / Day
                                </div>
                                <TextField
                                  autoComplete="off"
                                  className="Text-Input"
                                  label="Price"
                                  variant="outlined"
                                  size="small"
                                  name="AcDoubleBedRoomPrice"
                                  value={state.AcDoubleBedRoomPrice}
                                  onChange={this.handleChanges}
                                />
                              </div>
                            </div>
                            <div className="NonAcRoom-Setting">
                              <div className="Title">Non Ac Room</div>
                              <div className="Input-Field">
                                <div className="Text">No. Of Total Room</div>
                                <TextField
                                  autoComplete="off"
                                  error={state.TotalRoomFlag}
                                  className="Text-Input"
                                  label="Total Room"
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  name="TotalRoom"
                                  value={state.TotalRoom}
                                  onChange={this.handleChanges}
                                />
                              </div>
                              <div className="Input-Field">
                                <div className="Text">No. Of Non Ac Room</div>
                                <TextField
                                  error={state.NonAcRoomFlag}
                                  autoComplete="off"
                                  className="Text-Input"
                                  label="Non Ac Room"
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  name="NonAcRoom"
                                  value={state.NonAcRoom}
                                  onChange={this.handleChanges}
                                />
                              </div>
                              <div className="Input-Field">
                                <div className="Text">
                                  No. Of Single Bed Room
                                </div>
                                <TextField
                                  error={state.NoOfNonAcSingleBedRoomFlag}
                                  autoComplete="off"
                                  className="Text-Input"
                                  label="No. Of Sigle Bed Room"
                                  variant="outlined"
                                  size="small"
                                  name="NoOfNonAcSingleBedRoom"
                                  value={state.NoOfNonAcSingleBedRoom}
                                  onChange={this.handleChanges}
                                />
                              </div>
                              <div className="Input-Field">
                                <div className="Text">
                                  Single Bed Room Price / Day
                                </div>
                                <TextField
                                  autoComplete="off"
                                  className="Text-Input"
                                  label="Price"
                                  variant="outlined"
                                  size="small"
                                  name="NonAcSingleBedRoomPrice"
                                  value={state.NonAcSingleBedRoomPrice}
                                  onChange={this.handleChanges}
                                />
                              </div>
                              <div className="Input-Field">
                                <div className="Text">
                                  No. Of Double Bed Room
                                </div>
                                <TextField
                                  error={state.NoOfNonAcDoubleBedRoomFlag}
                                  autoComplete="off"
                                  className="Text-Input"
                                  label="No. Of Room"
                                  variant="outlined"
                                  size="small"
                                  name="NoOfNonAcDoubleBedRoom"
                                  value={state.NoOfNonAcDoubleBedRoom}
                                  onChange={this.handleChanges}
                                />
                              </div>
                              <div className="Input-Field">
                                <div className="Text">
                                  Double Bed Room Price / Day
                                </div>
                                <TextField
                                  autoComplete="off"
                                  className="Text-Input"
                                  label="Price"
                                  variant="outlined"
                                  size="small"
                                  name="NonAcDoubleBedRoomPrice"
                                  value={state.NonAcDoubleBedRoomPrice}
                                  onChange={this.handleChanges}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="Button">
                            <Button
                              variant="contained"
                              color="primary"
                              component="span"
                              style={{ margin: "10px 0 0 0" }}
                              onClick={
                                state.Update
                                  ? this.handleUpdate
                                  : this.handleSubmit
                              }
                            >
                              {state.Update ? <>Update</> : <>Apply Changes</>}
                            </Button>
                            <Button
                              variant="contained"
                              component="span"
                              style={{
                                margin: "10px 0 0 20px",
                                backgroundColor: "black",
                                color: "white",
                              }}
                              onClick={this.handleClose}
                            >
                              Cancle
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </Fade>
                </Modal>

                <Modal
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  open={this.state.OpenEdit}
                  // open={true}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={this.state.OpenEdit}>
                    {state.OpenBookModel ? (
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "1000px",
                          height: "600px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div className="Input-Field1">
                          <div className="Text">Room Type :</div>
                          <div className="Text-Input">{state.RoomType}</div>
                        </div>
                        <div className="Input-Field1">
                          <div className="Text">Room Scenerio :</div>
                          <div className="Text-Input">{state.RoomScenerio}</div>
                        </div>
                        <div className="Input-Field1">
                          <div className="Text">Room Price :</div>
                          <div className="Text-Input">
                            {state.TotalRoomPrice} Rs.
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              padding: "10px",
                            }}
                          >
                            <div className="Input-Field">
                              <div className="Text">Customer Name</div>
                              <TextField
                                autoComplete="off"
                                error={state.CustomerNameFlag}
                                className="Text-Input"
                                label="Name"
                                variant="outlined"
                                size="small"
                                name="CustomerName"
                                value={state.CustomerName}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Contact</div>
                              <TextField
                                autoComplete="off"
                                error={state.ContactFlag}
                                className="Text-Input"
                                label="Contact"
                                variant="outlined"
                                size="small"
                                name="Contact"
                                value={state.Contact}
                                onChange={this.handleChangeContact}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">EmailID</div>
                              <TextField
                                autoComplete="off"
                                error={state.EmailIDFlag}
                                className="Text-Input"
                                label="EmailID"
                                variant="outlined"
                                size="small"
                                name="EmailID"
                                value={state.EmailID}
                                onChange={this.handleChangeEmail}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Address</div>
                              <TextField
                                autoComplete="off"
                                error={state.AddressFlag}
                                className="Text-Input"
                                label="Address"
                                variant="outlined"
                                size="small"
                                name="Address"
                                value={state.Address}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Age</div>
                              <TextField
                                error={state.AgeFlag}
                                autoComplete="off"
                                className="Text-Input"
                                label="College Name"
                                placeholder="Ex. 24"
                                variant="outlined"
                                size="small"
                                name="Age"
                                value={state.Age}
                                onChange={this.handleChanges}
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              padding: "10px",
                            }}
                          >
                            <div className="Input-Field">
                              <div className="Text">Check In Time</div>
                              <TextField
                                error={state.CheckInTimeFlag}
                                autoComplete="off"
                                className="Text-Input"
                                placeholder="dd/MM/yyyy HH:mm tt"
                                variant="outlined"
                                size="small"
                                name="CheckInTime"
                                type="datetime-local"
                                value={state.CheckInTime}
                                onChange={this.handleTimeChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Check Out Time</div>
                              <TextField
                                error={state.CheckOutTimeFlag}
                                autoComplete="off"
                                className="Text-Input"
                                // label="Skill"
                                placeholder="Ex. Coding etc."
                                variant="outlined"
                                size="small"
                                name="CheckOutTime"
                                type="datetime-local"
                                value={state.CheckOutTime}
                                onChange={this.handleTimeChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">ID Proof</div>
                              <FormControl
                                variant="outlined"
                                style={{ minWidth: 292 }}
                                size="small"
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  ID
                                </InputLabel>

                                <Select
                                  error={state.IDProofFlag}
                                  labelId="demo-simple-select-outlined-label"
                                  value={state.IDProof}
                                  name="IDProof"
                                  onChange={this.handleField}
                                  label="IDProof"
                                >
                                  {Array.isArray(state.IDProofList) &&
                                  state.IDProofList.length > 0 ? (
                                    state.IDProofList.map(function (
                                      data,
                                      index
                                    ) {
                                      // console.log('Field : ', data.fieldName)
                                      return (
                                        <MenuItem value={data} key={index}>
                                          {data}
                                        </MenuItem>
                                      );
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </Select>
                              </FormControl>
                            </div>

                            <div className="Input-Field">
                              <div className="Text">ID Number</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="ID Number"
                                error={state.IDNumberFlag}
                                variant="outlined"
                                size="small"
                                type="number"
                                name="IDNumber"
                                value={state.IDNumber}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">PinCode</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="PinCode"
                                placeholder="Ex: 4110048"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="Pincode"
                                value={state.Pincode}
                                onChange={this.handleChangePinCode}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="Input-Field"
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            style={{ margin: "10px 10px 0 0" }}
                            onClick={this.handleUpdate}
                          >
                            {state.Update ? <>Update</> : <>Submit</>}
                            &nbsp;Application
                          </Button>
                          <Button
                            variant="outlined"
                            style={{ margin: "10px 0 0 10px" }}
                            onClick={this.handleClose}
                          >
                            Cancle
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "500px",
                          height: "250px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className="Input-Field"
                          style={{
                            color: "red",
                            fontSize: "20px",
                            fontFamily: "Roboto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: " 0 0 50px 0",
                            fontWeight: 500,
                          }}
                        >
                          Are You Sure To Pay Bill For Booking ID{" "}
                          {state.CustomerID}&nbsp;?
                        </div>
                        <div style={{ display: "flex" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            style={{ margin: "10px 10px 0 0" }}
                            onClick={() => {
                              this.handlePayCustomerBill(this.state.CustomerID);
                            }}
                          >
                            Yes
                          </Button>
                          <Button
                            variant="outlined"
                            style={{
                              margin: "10px 0 0 10px",
                              color: "white",
                              background: "black",
                            }}
                            onClick={this.handleClose}
                          >
                            No
                          </Button>
                        </div>
                      </div>
                    )}
                  </Fade>
                </Modal>

                {state.RejectApplication ? (
                  <Modal
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    open={this.state.RejectApplication}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={this.state.RejectApplication}>
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "500px",
                          height: "300px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className="Input-Field"
                          style={{
                            width: 450,
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Are you sure you want to Reject ApplicationID{" "}
                          {this.state.ApplicationID}
                        </div>
                        <Button
                          variant="contained"
                          color="Secondary"
                          component="span"
                          style={{ margin: "10px 0 0 0" }}
                          onClick={() => {
                            this.handleApplicationDeletion(state.ApplicationID);
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="contained"
                          // color="primary"
                          component="span"
                          style={{
                            margin: "10px 0 0 0",
                            background: "black",
                            color: "white",
                          }}
                          onClick={() => {
                            this.handleClose();
                          }}
                        >
                          Cancle
                        </Button>
                      </div>
                    </Fade>
                  </Modal>
                ) : null}
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
