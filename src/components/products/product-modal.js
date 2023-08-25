import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Image from 'next/image'
import {
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

export default function ProductModal(props) {
  const { content, open, handleClose } = props;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        sx={{
          background: '#fff',
          padding: '20px',
          borderRadius: '5px',
          width: '80vw',
          maxWidth: '1000px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {
          content.status === "error" ?
            <>
              <Typography variant='error'>
                ERROR!
              </Typography>
              <Typography >
                {content.message}
              </Typography>
            </>
            :
            content.data &&
            <Grid container >
              <Grid
                xs={6}
                md={6}
                sx= {{
                  height: '500px',
                  position: 'relative'
                }}
              >
                <Image
                  src={content.data.featuredImage.url}
                  fill={true}
                  alt="Picture of the author"
                  className='shopify-fill'
                  sizes="270 640 750"
                />
              </Grid>
              <Grid
                xs={6}
                md={6}
              >
                <Typography variant='h2' mb={1}>
                  {content.data.title}
                </Typography>
                <Typography variant='h4' mb={1}>
                  ${content.data.priceRange.maxVariantPrice.amount}
                </Typography>
                <Typography variant='body2' mb={1}>
                  {content.data.description}
                </Typography>
                <Typography variant='subtitle1'>
                  Available options :
                </Typography>
                {
                  content.data.options.map((opt,i) => {
                    return (
                      <Typography variant='subtitle2' key={opt+i}>
                        {opt.name}: {opt.values.map((optVal) => {return(<span key={optVal} className='opt-list'>{optVal}</span>)})}
                      </Typography>
                    )
                  })
                }
              </Grid>
            </Grid>
        }
      </Box>
    </Modal>
  );
}