import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { withApollo, graphql, compose } from 'react-apollo'

import MicroData from './components/MicroData'
import ProductDataLayer from './components/ProductDataLayer'
import productQuery from './queries/productQuery.gql'
import productPreviewFragment from './queries/productPreview.gql'
import {cacheLocator} from './cacheLocator'

class ProductContextProvider extends Component {
  static propTypes = {
    params: PropTypes.object,
    data: PropTypes.object,
    children: PropTypes.node,
  }

  render() {
    const { data, params: { slug }, client } = this.props
    const { loading } = data
    const productPreview = client.readFragment({
      id: cacheLocator.product(slug),
      fragment: productPreviewFragment
    })
    const product = loading ? productPreview : data.product
    const categories = product && product.categories

    const productQuery = {
      categories,
      loading,
      product,
    }

    return (
      <div className="vtex-product-details-container">
        <Fragment>
          {product && <MicroData product={product} />}
          <ProductDataLayer data={this.props.data}>
            {React.cloneElement(this.props.children, {
              productQuery,
              slug,
            })}
          </ProductDataLayer>
        </Fragment>
      </div>
    )
  }
}

const options = {
  options: props => ({
    variables: {
      slug: props.params.slug,
    },
  }),
}

export default compose(
  withApollo,
  graphql(productQuery, options)
)(ProductContextProvider)