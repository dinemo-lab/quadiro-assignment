const express = require('express');
const Car = require('../models/Car');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, manufacturingYear, price } = req.body;

  try {
    const car = new Car({ name, manufacturingYear, price });
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/', protect, async (req, res) => {
    try {
      const cars = await Car.find({});
      const totalCars = cars.length;
      res.json({ totalCars, cars });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  







router.put('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.name = req.body.name || car.name;
    car.manufacturingYear = req.body.manufacturingYear || car.manufacturingYear;
    car.price = req.body.price || car.price;

    await car.save();
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// router.delete('/:id', protect, async (req, res) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied' });
//   }

//   try {
//     const car = await Car.findById(req.params.id);
//     if (!car) {
//       return res.status(404).json({ message: 'Car not found' });
//     }

//     await car.remove();
//     res.json({ message: 'Car removed' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.delete('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
  }

  try {
      const car = await Car.findById(req.params.id);
      console.log('Car object:', car); // Log the car object

      if (!car) {
          return res.status(404).json({ message: 'Car not found' });
      }

      await Car.deleteOne({ _id: req.params.id });
      res.json({ message: 'Car removed' });
  } catch (error) {
      console.error('Error removing car:', error.message);
      res.status(500).json({ message: error.message });
  }
});


module.exports = router;
