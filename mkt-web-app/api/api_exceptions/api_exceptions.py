class Error(Exception):
    """Base class for exceptions in this module."""
    pass


class ParameterError(Error):
    """Exception raised for errors in the params file.

    Attributes:
        expression -- parameter expression in which the error occurred
        message -- explanation of the error
    """

    def __init__(self, expression, message):
        self.expression = expression
        self.message = message
