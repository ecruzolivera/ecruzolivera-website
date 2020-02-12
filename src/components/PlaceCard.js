import React from 'react'
import PropTypes from 'prop-types'

const PlaceCard = ({ place }) => (
  <div className='flex flex-col text-center sm:flex-row sm:text-left'>
    <p className='mr-2 text-center sm:text-right sm:w-1/5'>
      {place.start_date}
      {place.end_date ? ' - ' + place.end_date : ''}
    </p>
    <div>
      <h3 className='text-gray-100'>{place.title}</h3>
      <p className='text-gray-500 text-sm'>{place.place}</p>
      <p className='text-gray-500 text-sm italic'>
        {place.city}, {place.country}.
      </p>
    </div>
  </div>
)

PlaceCard.propTypes = {
  place: PropTypes.object.isRequired,
}

export default PlaceCard
