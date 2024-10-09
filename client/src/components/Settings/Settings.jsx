const [selectedPfp, setSelectedPfp] = useState(currentUserPfp);
const handlePfpChange = (newPfp) => setSelectedPfp(newPfp);

const handleSave = async () => {
  await updatePfp(selectedPfp);
};
