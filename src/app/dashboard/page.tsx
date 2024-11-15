import { DashboardPage } from '@/components/dashboard-page'
import { db } from '@/db'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardPageContent } from './dashboard-page-content'

const Page = async () => {
  // clerk 中的当前用户，借助 clerk 服务，在 clerk 中创建一个用户之后，会连接 prima 数据库，在数据库中添加一个新的用户
  const auth = await currentUser()

  if (!auth) {
    redirect('/sign-in')
  }

  // 数据库中创建的用户
  const user = await db.user.findUnique({
    where: {
      externalId: auth.id,
    },
  })

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <DashboardPage title="Dashboard">
      <DashboardPageContent/>
    </DashboardPage>
  )
}

export default Page
