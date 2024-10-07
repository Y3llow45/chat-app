const pfpList = ['pfp1.jpg', 'pfp2.jpg', 'pfp3.jpg', 'pfp4.jpg'];

const genRandomPfp = () => {
  var index = pfpList[Math.floor(Math.random() * pfpList.length)]
  return index;
};

module.exports = genRandomPfp;