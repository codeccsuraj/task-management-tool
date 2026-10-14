import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetTicketByIdQuery } from '../../features/ticket/api/ticketApi';

const TicketDetail = () => {
    const { ticketId } = useParams();

    const { data: ticketRes, isLoading: ticketLoading } = useGetTicketByIdQuery(ticketId, {
        skip: !ticketId
    });
    const ticketData = ticketRes?.data;
    console.log("ticketRes", ticketRes)

    if (ticketLoading) {
        return <p>Data is loading...</p>
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-8'>
                    <div className="navbar mb-3">
                        <ul className='nav gap-3'>
                            <li className="nav-item">
                                <span className='nav-link badge text-bg-primary'>{ticketData?.ticketId}</span>
                            </li>
                            <li className="nav-item">
                                <span className='nav-link badge bg-primary-subtle text-dark'>{ticketData?.status}</span>
                            </li>
                            <li className="nav-item">
                                <span className='nav-link badge bg-danger-subtle text-dark'>{ticketData?.priority}</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3>{ticketData?.title}</h3>
                    </div>
                </div>
                <div className='col-4'></div>
            </div>
        </div>
    )
}

export default TicketDetail
