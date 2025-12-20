import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Plant from "../models/Plant.js";
import Category from "../models/Category.js";

export const getAdminDashboardSummary = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    /* ---------------- DATE FILTER ---------------- */
    const dateFilter = {};
    if (fromDate || toDate) {
      dateFilter.createdAt = {};
      if (fromDate) dateFilter.createdAt.$gte = new Date(fromDate);
      if (toDate) dateFilter.createdAt.$lte = new Date(toDate);
    }

    /* ---------------- ORDERS ---------------- */
    const totalOrders = await Order.countDocuments(dateFilter);
    const pendingOrders = await Order.countDocuments({
      ...dateFilter,
      status: "Pending",
    });
    const paidOrders = await Order.countDocuments({
      ...dateFilter,
      status: "Paid",
    });
    const deliveredOrders = await Order.countDocuments({
      ...dateFilter,
      status: "Delivered",
    });
    const cancelledOrders = await Order.countDocuments({
      ...dateFilter,
      status: "Cancelled",
    });
    const failedOrders = await Order.countDocuments({
      ...dateFilter,
      status: "Failed",
    });

    /* ---------------- PAYMENTS ---------------- */
    const totalPayments = await Payment.countDocuments(dateFilter);
    const successfulPayments = await Payment.countDocuments({
      ...dateFilter,
      status: "Success",
    });
    const failedPayments = await Payment.countDocuments({
      ...dateFilter,
      status: "Failed",
    });

    /* ---------------- REVENUE ---------------- */
    const revenueAgg = await Payment.aggregate([
      { $match: { status: "Success", ...dateFilter } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    /* ---------------- USERS ---------------- */
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments(dateFilter);

    /* ---------------- PLANTS ---------------- */
    const totalPlants = await Plant.countDocuments();
    const outOfStockPlants = await Plant.countDocuments({
      stock: { $lte: 0 },
    });

    /* ---------------- CATEGORIES ---------------- */
    const totalCategories = await Category.countDocuments();

    /* ---------------- TOP SELLING PLANTS ---------------- */
    const topPlants = await OrderDetail.aggregate([
      {
        $group: {
          _id: "$plantId",
          totalSold: { $sum: "$quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "plants",
          localField: "_id",
          foreignField: "_id",
          as: "plant",
        },
      },
      { $unwind: "$plant" },
      {
        $project: {
          _id: 0,
          plantId: "$plant._id",
          name: "$plant.name",
          totalSold: 1,
        },
      },
    ]);

    /* ---------------- RESPONSE ---------------- */
    res.status(200).json({
      success: true,
      summary: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          delivered: deliveredOrders,
          paid: paidOrders,
          cancelled: cancelledOrders,
          failed: failedOrders,
        },
        payments: {
          total: totalPayments,
          success: successfulPayments,
          failed: failedPayments,
        },
        revenue: {
          total: totalRevenue,
        },
        users: {
          total: totalUsers,
          new: newUsers,
        },
        plants: {
          total: totalPlants,
          outOfStock: outOfStockPlants,
        },
        categories: {
          total: totalCategories,
        },
        topPlants,
      },
    });
  } catch (error) {
    console.error("Admin dashboard summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary",
    });
  }
};
