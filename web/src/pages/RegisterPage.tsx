import Button from '../components/ui/Button'
import Layout from '../components/layout/Layout.tsx'

export default function RegisterPage() {
  return(
    <Layout>
      <h1>Inscription</h1>
      <Button>S'inscrire</Button>
      <a href="/login">Déjà un compte ? Se connecter</a>
    </Layout>
  )
}
