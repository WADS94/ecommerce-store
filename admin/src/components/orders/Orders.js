import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/ro";

const Orders = (props) => {
  const { orders } = props;
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Nume</th>
          <th scope="col">Email</th>
          <th scope="col">Total</th>
          <th scope="col">Platit</th>
          <th scope="col">Data</th>
          <th>Status</th>
          <th scope="col" className="text-end">
            Detalii
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td>
              <b>{order.user.name}</b>
            </td>
            <td>{order.user.email}</td>
            <td>{order.totalPrice} Lei</td>
            <td>
              {order.isPaid ? (
                <span className="badge rounded-pill alert-success">
                  Platit {moment(order.paidAt).format("Do MMM YYYY")}
                </span>
              ) : (
                <span className="badge rounded-pill alert-danger">
                  Neplatit
                </span>
              )}
            </td>
            <td>{moment(order.createdAt).format("Do MMM YYYY")}</td>
            <td>
              {order.isDelivered ? (
                <span className="badge btn-success">Livrat</span>
              ) : (
                <span className="badge btn-dark">Nu a fost livrat</span>
              )}
            </td>
            <td className="d-flex justify-content-end align-item-center">
              <Link to={`/order/${order._id}`} className="text-success">
                <i className="fas fa-eye"></i>
              </Link>
            </td>
          </tr>
        ))}

        {/* Not paid Not delivered */}
        {/* <tr>
          <td>
            <b>Velcro Sneakers For Boys & Girls (Blue)</b>
          </td>
          <td>user@example.com</td>
          <td>$45,789</td>
          <td>
            <span className="badge rounded-pill alert-danger">Not paid</span>
          </td>
          <td>Dec 12 2021</td>
          <td>
            <span className="badge btn-dark">Not Delivered</span>
          </td>
          <td className="d-flex justify-content-end align-item-center">
            <Link to={`/order`} className="text-success">
              <i className="fas fa-eye"></i>
            </Link>
          </td>
        </tr> */}
      </tbody>
    </table>
  );
};

export default Orders;
