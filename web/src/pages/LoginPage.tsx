import Button from '../components/ui/Button'
import Layout from '../components/layout/Layout.tsx'

export default function LoginPage() {
  return(
    <Layout>
      <h2>Connexion</h2>
      <Button>Se Connecter</Button>
      <a href="/register">S'inscrire ?</a>
    </Layout>
  )
}
