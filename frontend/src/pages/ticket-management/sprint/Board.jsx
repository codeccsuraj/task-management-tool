import React, { useState } from 'react'
import Heading from '../../../components/custom/Heading'
import ButtonInput from '../../../components/form/ButtonInput'
import AddTicket from '../../../features/ticket/create/AddTicket'

const Board = () => {
  const [showAddTicket, setAddTicket] = useState(false)
  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <Heading title='Sprint Board' subtitle='Sep 15 - Sep 28 - 6 days remaining' />
        <ButtonInput
          type="button"
          className="btn-submit"
          label="+ Create ticket"
          onClick={() => setAddTicket(true)}
        />
      </div>

      <AddTicket open={showAddTicket} onClose={() => setAddTicket(false)} />
    </div>
  )
}

export default Board
