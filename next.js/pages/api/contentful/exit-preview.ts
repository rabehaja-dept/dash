export default function handler(req, res) {
  const { redirect } = req.query;

  if (!redirect) {
    return res.status(400).json({ message: "Invalid redirect" });
  }

  res.setDraftMode({ enable: false });
  res.redirect(req.query.redirect);
}
