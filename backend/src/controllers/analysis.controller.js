import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Plant from "../models/Plant.js";
import Category from "../models/Category.js";

export const getAdminDashboardSummary = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const dateFilter = {};
    if (fromDate || toDate) {
      dateFilter.createdAt = {};
      if (fromDate) dateFilter.createdAt.$gte = new Date(fromDate);
      if (toDate) dateFilter.createdAt.$lte = new Date(toDate);
    }

    const totalOrders = await Order.countDocuments(dateFilter);

    const paymentPendingOrders = await Order.countDocuments({
      ...dateFilter,
      status: "PaymentPending",
    });

    const confirmedOrders = await Order.countDocuments({
      ...dateFilter,
      status: "Confirmed",
    });

    const shippedOrders = await Order.countDocuments({
      ...dateFilter,
      status: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      ...dateFilter,
      status: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      ...dateFilter,
      status: "Cancelled",
    });

    const paymentFailedOrders = await Order.countDocuments({
      ...dateFilter,
      status: "PaymentFailed",
    });

    const totalPayments = await Payment.countDocuments(dateFilter);
    const successfulPayments = await Payment.countDocuments({
      ...dateFilter,
      status: "Success",
    });
    const failedPayments = await Payment.countDocuments({
      ...dateFilter,
      status: "Failed",
    });

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

    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments(dateFilter);

    const totalPlants = await Plant.countDocuments();
    const outOfStockPlants = await Plant.countDocuments({
      stock: { $lte: 0 },
    });

    const totalCategories = await Category.countDocuments();

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

    res.status(200).json({
      success: true,
      summary: {
        orders: {
          total: totalOrders,
          paymentPending: paymentPendingOrders,
          confirmed: confirmedOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
          paymentFailed: paymentFailedOrders,
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
    console.error(
      "error in get AdminDashboardSummary analysis.controller:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary",
    });
  }
};
