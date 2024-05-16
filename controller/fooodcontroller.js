const Food = require('../models/food');
const user=require('../models/user')
// Get all food items
const getAllFoodItems = async (req, res) => {
    try {
        const foodItems = await Food.find();
        res.json(foodItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//get id of food item
const getFoodItem = async (req, res) => {
    const { id } = req.params;
    try {
        const foodItem = await Food.findById(id);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json(foodItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const addFoodItem = async (req, res) => {
    const { items } = req.body;
    const newFoodItem = new Food({ items});
    try {
        await newFoodItem.save();
        res.status(201).json(newFoodItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Update a food item
const updateFoodItem = async (req, res) => {
    const { id } = req.params;
    const { totalprice } = req.body;
    try {
        const updatedFoodItem = await Food.findByIdAndUpdate(id, { totalprice }, { new: true });

        if (!updatedFoodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.json(updatedFoodItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Delete a food item
const deleteFoodItem = async (req, res) => {
    const { id } = req.params;
    try {
        await Food.findByIdAndDelete(id);
        res.json({ message: 'Food item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const bookFood = async (req, res) => {
    try {
        console.log('im in');
        const itemsArray = req.body;
        let  foodid=0;
        for (let i = 0; i < itemsArray.length; i++) {
            const { itemId, quantity, totalprice } = itemsArray[i];
            console.log('Item ID:', itemId);
            console.log('Quantity:', quantity);
            console.log('Total Price:', totalprice);

            const foodBeverage = await Food.findOne({ 'items._id': itemId });
            console.log('Food or beverage:', foodBeverage);

            if (!foodBeverage) {
                console.log('Food or beverage item not found');
                return res.status(404).json({ message: 'Food or beverage item not found' });
            }

            const selectedItem = foodBeverage.items.find(item => item._id.toString() === itemId);
            console.log('Selected item:', selectedItem);

            if (!selectedItem) {
                console.log('Selected item not found in items array');
                return res.status(404).json({ message: 'Food or beverage item not found in items array' });
            }

            if (selectedItem.quantity < quantity) {
                console.log('Not enough quantity available');
                return res.status(400).json({ message: 'Not enough quantity available' });
            }

            const User = await user.findById(req.userId);
            console.log('User ID:', req.userId);

            if (!User) {
                console.log('User not found');
                return res.status(404).json({
                    ok: false,
                    message: "User not found"
                });
            }

            // Update quantity and total price of the selected item
            selectedItem.quantity -= quantity;
            foodBeverage.totalprice += totalprice;
            foodBeverage.userId = req.userId;

            await foodBeverage.save();
            foodid=foodBeverage._id;
        }

        res.json({ message: 'Food or beverage items booked successfully' ,foodId:foodid});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const getItemsByType = async (req, res) => {
    const { type } = req.params;
    try {
        const foodItems = await Food.find();
        const filteredItems = foodItems.reduce((acc, curr) => {
            const filtered = curr.items.filter(item => item.type === type);
            return [...acc, ...filtered];
        }, []);
        console.log(filteredItems);
        res.json(filteredItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};






module.exports = {getAllFoodItems,addFoodItem,updateFoodItem, deleteFoodItem, getFoodItem,bookFood,getItemsByType,}
