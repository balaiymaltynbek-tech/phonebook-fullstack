
const errorHandler = (error, request, response, _next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({
      error: 'malformatted id'
    })
  }

  if (error.code === 11000) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  response.status(500).json({
    error: 'internal server error'
  })
}

export default { errorHandler }
