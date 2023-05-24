import moment from "moment";
import "moment/locale/ro";
import React from "react";
import { Link } from "react-router-dom";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";

const LatestOrder = (props) => {
  const { loading, error, orders } = props;
  return (
    <div className="card-body">
      <h4 className="card-title">Comenzi noi</h4>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="alert-danger">{error}</Message>
      ) : (
        <div className="table-responsive">
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
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td>
                    <b>{order.user.name}</b>
                  </td>
                  <td>{order.user.email}</td>
                  <td>{order.totalPrice} Lei</td>
                  <td>
                    {order.isPaid ? (
                      <span className="badge rounded-pill alert-success">
                        Platit la {moment(order.paidAt).format("Do MMM YYYY")}
                      </span>
                    ) : (
                      <span className="badge rounded-pill alert-danger">
                        Neplatit
                      </span>
                    )}
                  </td>
                  <td>{moment(order.createdAt).calendar()}</td>
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LatestOrder;
