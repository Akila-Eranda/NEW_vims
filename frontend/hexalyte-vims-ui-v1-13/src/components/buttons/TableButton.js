import React from 'react'

function TableButton({ click, children, actionName }) {
  return (
    <button onClick={ () => alert(` ${actionName} ProductID ${click.ProductID} ? `) } > { children } </button> 
  )
}

export default TableButton