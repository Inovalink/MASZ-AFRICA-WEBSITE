const DotPatternBg = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 455 660"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    {/* Dot grid pattern – white squares at 32% opacity with overlay blend */}
    {[
      [[274.676,0],[291.848,0],[309.02,0],[326.184,0],[343.352,0]],
      [[51.5,16.268],[68.672,16.268],[85.84,16.268],[103.008,16.268],[120.172,16.268],[137.352,16.268],[154.508,16.268],[171.672,16.268],[188.84,16.268],[206.016,16.268],[223.184,16.268],[240.348,16.268],[274.676,16.268],[291.848,16.268],[309.02,16.268],[326.184,16.268],[343.352,16.268]],
    ].flat().length && null}
    <image href="" />
  </svg>
);
export default DotPatternBg;
