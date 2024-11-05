import { Heading } from './components/heading'
import { MaxWidthWrappar } from './components/max-width-wrapper'

const Page = () => {
  return (
    <>
      <section className="relative py-24 sm:py-32 bg-brand-25">
        <MaxWidthWrappar className="text-center">
          <div className="relative mx-auto text-center items-center flex flex-col gap-10">
            <div>
              <Heading>
                <span>Real-Time Sass Insight,</span>
                <br />
                <span className="relative bg-gradient-to-r from-brand-700 to-brand-800 bg-clip-text text-transparent">
                  Delivered to Your Discord
                </span>
              </Heading>
            </div>
          </div>
        </MaxWidthWrappar>
      </section>
      <section></section>
      <section></section>
      <section></section>
      <section></section>
    </>
  )
}

export default Page
