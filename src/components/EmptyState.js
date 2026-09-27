import React from 'react'
import { useNavigate } from 'react-router-dom'

const EmptyState = ({ 
  icon = '📭', 
  title = 'Nothing to see here', 
  message = 'There are no items to display at the moment.',
  buttonText,
  buttonAction 
}) => {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    if (typeof buttonAction === 'string') {
      navigate(buttonAction)
    } else if (typeof buttonAction === 'function') {
      buttonAction()
    }
  }

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      {buttonText && buttonAction && (
        <button
          onClick={handleButtonClick}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}

export default EmptyState