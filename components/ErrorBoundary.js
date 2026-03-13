import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0b09',
          fontFamily: 'monospace',
          color: 'rgba(240,235,227,0.4)',
          fontSize: 13,
          letterSpacing: '0.05em',
          textAlign: 'center',
          padding: 32,
        }}>
          <div>
            <div style={{ color: '#c4956a', marginBottom: 16, fontSize: 11 }}>◆</div>
            something went wrong
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
